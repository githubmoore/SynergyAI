
'use server';
/**
 * @fileOverview Recommends AI tools and shortcuts based on user query analysis.
 *
 * - recommendAiShortcuts - Analyzes a query and suggests relevant AI tools.
 * - RecommendAIShortcutsInput - Input schema for the flow.
 * - RecommendAIShortcutsOutput - Output schema for the flow.
 * - AIRecommendation - Schema for a single AI recommendation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendAIShortcutsInputSchema = z.object({
  query: z.string().describe('The user query to analyze for AI tool recommendations.'),
});
export type RecommendAIShortcutsInput = z.infer<typeof RecommendAIShortcutsInputSchema>;

const AIRecommendationSchema = z.object({
  name: z.string().describe("The official name of the AI tool or model (e.g., 'DALL-E 3', 'GitHub Copilot')."),
  logoUrl: z
    .string()
    .url()
    .describe("A URL to an image representing the AI tool. Use 'https://picsum.photos/50/50' as a placeholder if a real logo isn't known, add a query parameter based on the task category e.g. ?<category_keyword>."),
  description: z
    .string()
    .describe("A brief (1-2 sentences) description of the AI tool's capabilities and specialization relevant to the user's query."),
  websiteUrl: z.string().url().describe('The official website URL where the user can access or learn more about the AI tool.'),
  taskCategory: z
    .string()
    .describe("The primary task category identified for the user's query (e.g., 'Image Generation', 'Code Generation', 'Text Summarization')."),
});
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;

const RecommendAIShortcutsOutputSchema = z.object({
  recommendations: z.array(AIRecommendationSchema).describe('A list of 1 to 3 AI tool recommendations.'),
});
export type RecommendAIShortcutsOutput = z.infer<typeof RecommendAIShortcutsOutputSchema>;

export async function recommendAiShortcuts(input: RecommendAIShortcutsInput): Promise<RecommendAIShortcutsOutput> {
  return recommendAiShortcutsFlow(input);
}

const recommendSystemPrompt = `You are an AI assistant that recommends other AI tools based on a user's query.
Analyze the user's query to understand the primary task they want to accomplish.
Determine the primary task category (e.g., 'Image Generation', 'Code Generation', 'Text Summarization', 'Creative Writing', 'Data Analysis', 'Translation', 'Research').
Based on the identified task category, recommend 1 to 3 suitable and well-known AI tools or models.
For each recommendation, you must provide:
- name: The official name of the AI tool/model.
- logoUrl: A placeholder image URL. Construct this URL as 'https://picsum.photos/50/50?query=AI' where 'AI' can be replaced by a one-word keyword for the task category (e.g., 'image', 'code', 'text').
- description: A brief (1-2 sentences) description of what the AI does and its specialization relevant to the query.
- websiteUrl: The official website URL for the AI tool/model. If an official URL for a specific model (like GPT-4) is not directly linkable, provide the URL to the platform offering it (e.g., OpenAI's website).
- taskCategory: The identified task category.

Ensure your response strictly adheres to the JSON schema provided for the output.
Example AI tools for categories:
- Image Generation: DALL-E 3, Midjourney, Stable Diffusion
- Code Generation: GitHub Copilot, Amazon CodeWhisperer, Tabnine
- Text Summarization: ChatGPT, Claude, Gemini
- Creative Writing: Jasper, Rytr, ChatGPT
- Data Analysis: Julius AI, Wolfram Alpha
- Translation: Google Translate, DeepL
- Research: Perplexity AI, Elicit

User Query: {{{query}}}
`;

const recommendAiShortcutsPrompt = ai.definePrompt({
  name: 'recommendAiShortcutsPrompt',
  input: {schema: RecommendAIShortcutsInputSchema},
  output: {schema: RecommendAIShortcutsOutputSchema},
  prompt: recommendSystemPrompt,
});

const recommendAiShortcutsFlow = ai.defineFlow(
  {
    name: 'recommendAiShortcutsFlow',
    inputSchema: RecommendAIShortcutsInputSchema,
    outputSchema: RecommendAIShortcutsOutputSchema,
  },
  async input => {
    const {output} = await recommendAiShortcutsPrompt(input);
    if (!output) {
        throw new Error("No output received from AI for recommendations.");
    }
    // Ensure logoUrl has a query param based on taskCategory for picsum
    const processedRecommendations = output.recommendations.map(rec => {
      let logoUrl = rec.logoUrl;
      if (logoUrl.startsWith('https://picsum.photos/50/50')) {
        const categoryKeyword = rec.taskCategory.split(' ')[0].toLowerCase() || 'abstract';
        logoUrl = `https://picsum.photos/50/50?query=${encodeURIComponent(categoryKeyword)}`;
      }
      return { ...rec, logoUrl };
    });

    return { recommendations: processedRecommendations };
  }
);
