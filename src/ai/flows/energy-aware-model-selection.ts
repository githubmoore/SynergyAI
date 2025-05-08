'use server';
/**
 * @fileOverview A flow that dynamically selects the most energy-efficient model for a given task.
 *
 * - energyAwareModelSelection - A function that handles the selection of the most energy-efficient model.
 * - EnergyAwareModelSelectionInput - The input type for the energyAwareModelSelection function.
 * - EnergyAwareModelSelectionOutput - The return type for the energyAwareModelSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnergyAwareModelSelectionInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be performed.'),
  availableModels: z.array(z.string()).describe('The list of available AI models.'),
});
export type EnergyAwareModelSelectionInput = z.infer<typeof EnergyAwareModelSelectionInputSchema>;

const EnergyAwareModelSelectionOutputSchema = z.object({
  selectedModel: z.string().describe('The name of the selected AI model.'),
  reason: z.string().describe('The reason for selecting the model.'),
});
export type EnergyAwareModelSelectionOutput = z.infer<typeof EnergyAwareModelSelectionOutputSchema>;

export async function energyAwareModelSelection(input: EnergyAwareModelSelectionInput): Promise<EnergyAwareModelSelectionOutput> {
  return energyAwareModelSelectionFlow(input);
}

const energyAwareModelSelectionPrompt = ai.definePrompt({
  name: 'energyAwareModelSelectionPrompt',
  input: {schema: EnergyAwareModelSelectionInputSchema},
  output: {schema: EnergyAwareModelSelectionOutputSchema},
  prompt: `You are an AI system that selects the most energy-efficient AI model for a given task.

You will receive a task description and a list of available AI models. You will select the most energy-efficient model that can perform the task without sacrificing performance.

Task Description: {{{taskDescription}}}
Available Models: {{#each availableModels}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider the following when selecting the model:
- The energy consumption of the model.
- The performance of the model on the given task.
- The cost of using the model.

Return the selected model and the reason for selecting the model.
`,
});

const energyAwareModelSelectionFlow = ai.defineFlow(
  {
    name: 'energyAwareModelSelectionFlow',
    inputSchema: EnergyAwareModelSelectionInputSchema,
    outputSchema: EnergyAwareModelSelectionOutputSchema,
  },
  async input => {
    const {output} = await energyAwareModelSelectionPrompt(input);
    return output!;
  }
);
