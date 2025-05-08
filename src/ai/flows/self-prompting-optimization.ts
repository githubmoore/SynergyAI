'use server';
/**
 * @fileOverview Implements a self-prompting optimization flow where AI models iteratively improve their prompts based on feedback from other models.
 *
 * - selfPromptingOptimization - A function that initiates the self-prompting optimization process.
 * - SelfPromptingOptimizationInput - The input type for the selfPromptingOptimization function.
 * - SelfPromptingOptimizationOutput - The return type for the selfPromptingOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelfPromptingOptimizationInputSchema = z.object({
  initialPrompt: z
    .string()
    .describe('The initial prompt to be optimized by the AI models.'),
  modelNames: z
    .array(z.string())
    .describe('An array of model names to participate in the optimization process.'),
  optimizationRounds: z
    .number()
    .int()
    .positive()
    .default(3)
    .describe('The number of iterative optimization rounds to perform.'),
});
export type SelfPromptingOptimizationInput = z.infer<
  typeof SelfPromptingOptimizationInputSchema
>;

const SelfPromptingOptimizationOutputSchema = z.object({
  optimizedPrompt: z.string().describe('The final optimized prompt.'),
  optimizationHistory: z
    .array(z.object({round: z.number(), prompt: z.string(), feedback: z.string()}))
    .describe('The history of prompt optimization across all rounds.'),
});
export type SelfPromptingOptimizationOutput = z.infer<
  typeof SelfPromptingOptimizationOutputSchema
>;

export async function selfPromptingOptimization(
  input: SelfPromptingOptimizationInput
): Promise<SelfPromptingOptimizationOutput> {
  return selfPromptingOptimizationFlow(input);
}

const promptOptimizationPrompt = ai.definePrompt({
  name: 'promptOptimizationPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The current prompt to be optimized.'),
      feedback: z.string().describe('Feedback on the current prompt.'),
    }),
  },
  output: {
    schema: z.object({
      optimizedPrompt: z
        .string()
        .describe('The optimized prompt based on the provided feedback.'),
    }),
  },
  prompt: `You are an expert prompt optimizer. Given the current prompt and the feedback, generate an improved prompt.

Current Prompt: {{{prompt}}}
Feedback: {{{feedback}}}

Optimized Prompt:`, // Improved prompt for the next round
});

const promptFeedbackPrompt = ai.definePrompt({
  name: 'promptFeedbackPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to provide feedback on.'),
    }),
  },
  output: {
    schema: z.object({
      feedback: z
        .string()
        .describe('Constructive feedback on the provided prompt.'),
    }),
  },
  prompt: `You are a prompt feedback provider. Provide constructive feedback on the following prompt, focusing on how it can be improved for accuracy and efficiency.

Prompt: {{{prompt}}}

Feedback:`, // Constructive feedback on the prompt
});

const selfPromptingOptimizationFlow = ai.defineFlow(
  {
    name: 'selfPromptingOptimizationFlow',
    inputSchema: SelfPromptingOptimizationInputSchema,
    outputSchema: SelfPromptingOptimizationOutputSchema,
  },
  async input => {
    let currentPrompt = input.initialPrompt;
    const optimizationHistory: Array<{round: number; prompt: string; feedback: string}> = [];

    for (let i = 0; i < input.optimizationRounds; i++) {
      // Get feedback on the current prompt
      const {output: feedbackOutput} = await promptFeedbackPrompt({
        prompt: currentPrompt,
      });
      const feedback = feedbackOutput!.feedback;

      // Optimize the prompt based on the feedback
      const {output: optimizationOutput} = await promptOptimizationPrompt({
        prompt: currentPrompt,
        feedback: feedback,
      });

      currentPrompt = optimizationOutput!.optimizedPrompt;

      optimizationHistory.push({
        round: i + 1,
        prompt: input.initialPrompt,
        feedback: feedback,
      });
    }

    return {
      optimizedPrompt: currentPrompt,
      optimizationHistory: optimizationHistory,
    };
  }
);
