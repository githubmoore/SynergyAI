// This is an experimental implementation and the parameters should be optimized for
// different models and prompts.

'use server';
/**
 * @fileOverview Implements a collaborative output refinement process where multiple AI models
 * review and correct each other's outputs through an internal feedback loop.
 *
 * - collaborativeOutputRefinement - A function that initiates the collaborative refinement process.
 * - CollaborativeOutputRefinementInput - The input type for the collaborativeOutputRefinement function.
 * - CollaborativeOutputRefinementOutput - The return type for the collaborativeOutputRefinement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollaborativeOutputRefinementInputSchema = z.object({
  query: z.string().describe('The original query from the user.'),
  modelNames: z.array(z.string()).describe('The names of the models to use for refinement.'),
});
export type CollaborativeOutputRefinementInput = z.infer<typeof CollaborativeOutputRefinementInputSchema>;

const CollaborativeOutputRefinementOutputSchema = z.object({
  refinedOutput: z.string().describe('The final refined output after the collaborative process.'),
  intermediateOutputs: z.array(z.string()).describe('The intermediate outputs from each model.'),
});
export type CollaborativeOutputRefinementOutput = z.infer<typeof CollaborativeOutputRefinementOutputSchema>;

export async function collaborativeOutputRefinement(
  input: CollaborativeOutputRefinementInput
): Promise<CollaborativeOutputRefinementOutput> {
  return collaborativeOutputRefinementFlow(input);
}

const refinePrompt = ai.definePrompt({
  name: 'refinePrompt',
  input: {
    schema: z.object({
      query: z.string().describe('The original query.'),
      initialOutput: z.string().describe('The initial output from a model.'),
      critique: z.string().optional().describe('A critique of the initial output.'),
    }),
  },
  output: {schema: z.string().describe('The refined output.')},
  prompt: `Given the original query: {{{query}}}, and an initial output: {{{initialOutput}}}. Refine the initial output to better address the query.
  {% if critique %}Take into account the following critique: {{{critique}}}.{% endif %}
  Return the refined output.`,
});

const critiquePrompt = ai.definePrompt({
  name: 'critiquePrompt',
  input: {
    schema: z.object({
      query: z.string().describe('The original query.'),
      output: z.string().describe('The output to critique.'),
    }),
  },
  output: {schema: z.string().describe('A critique of the output.')},
  prompt: `Given the original query: {{{query}}}, and the output: {{{output}}}. Provide a concise critique of the output, focusing on accuracy, clarity, and relevance to the query.`,
});

const collaborativeOutputRefinementFlow = ai.defineFlow(
  {
    name: 'collaborativeOutputRefinementFlow',
    inputSchema: CollaborativeOutputRefinementInputSchema,
    outputSchema: CollaborativeOutputRefinementOutputSchema,
  },
  async input => {
    const {query, modelNames} = input;
    const initialOutputs: string[] = [];
    // Call each model with the original query to get the initial output.
    for (const modelName of modelNames) {
      const {text} = await ai.generate({
        prompt: query,
        model: modelName,
      });
      initialOutputs.push(text!);
    }

    let refinedOutput = initialOutputs[0];
    // Refine the output iteratively using critiques from other models.
    for (let i = 1; i < initialOutputs.length; i++) {
      const critique = (await critiquePrompt({
        query: query,
        output: refinedOutput,
      })) as any;
      const {output} = await refinePrompt({
        query: query,
        initialOutput: refinedOutput,
        critique: critique.output,
      });
      refinedOutput = output!;
    }

    return {
      refinedOutput: refinedOutput,
      intermediateOutputs: initialOutputs,
    };
  }
);
