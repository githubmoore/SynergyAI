'use server';

/**
 * @fileOverview A dynamic query routing AI agent.
 *
 * - routeQuery - A function that handles the query routing process.
 * - RouteQueryInput - The input type for the routeQuery function.
 * - RouteQueryOutput - The return type for the routeQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteQueryInputSchema = z.object({
  query: z.string().describe('The user query to be routed.'),
});
export type RouteQueryInput = z.infer<typeof RouteQueryInputSchema>;

const RouteQueryOutputSchema = z.object({
  model: z.string().describe('The name of the AI model to use for the query.'),
  reason: z.string().describe('The reason for choosing the model.'),
});
export type RouteQueryOutput = z.infer<typeof RouteQueryOutputSchema>;

export async function routeQuery(input: RouteQueryInput): Promise<RouteQueryOutput> {
  return routeQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeQueryPrompt',
  input: {schema: RouteQueryInputSchema},
  output: {schema: RouteQueryOutputSchema},
  prompt: `You are an expert AI model router.  Given a user query, you will determine which open-source AI model is best suited to handle the query.

You must pick one of the following models:
- creativeModel: Best for creative tasks such as writing stories or poems.
- mathematicalModel: Best for mathematical tasks such as solving equations or calculating complex formulas.
- generalModel: Best for general knowledge questions and tasks.

Query: {{{query}}}

Based on the query, determine which model is the most appropriate and provide a reason for your choice. Return the model name in the 'model' field and the reasoning in the 'reason' field.

Ensure that the model field only contains the model's name. For example, creativeModel, mathematicalModel, or generalModel.
`,
});

const routeQueryFlow = ai.defineFlow(
  {
    name: 'routeQueryFlow',
    inputSchema: RouteQueryInputSchema,
    outputSchema: RouteQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
