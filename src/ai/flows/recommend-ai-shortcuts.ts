
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
  name: z.string().describe("The official name of the AI tool or model (e.g., 'DALL-E 3', 'GitHub Copilot', 'ChatGPT', 'Leonardo AI')."),
  logoUrl: z
    .string()
    .describe("A URL to an image representing the AI tool. Use 'https://picsum.photos/50/50' as a placeholder if a real logo isn't known, add a query parameter based on the task category e.g. ?<category_keyword>."),
  description: z
    .string()
    .describe("A brief (1-2 sentences) description of the AI tool's capabilities and specialization relevant to the user's query. Tailor this to the query."),
  websiteUrl: z.string().describe('The official website URL where the user can access or learn more about the AI tool.'),
  taskCategory: z
    .string()
    .describe("The primary task category identified for the user's query (e.g., 'Image Generation', 'Code Generation', 'Text Summarization', 'Chatbot', 'Research')."),
});
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;

const RecommendAIShortcutsOutputSchema = z.object({
  recommendations: z.array(AIRecommendationSchema).describe('A list of 1 to 3 AI tool recommendations relevant to the user query.'),
});
export type RecommendAIShortcutsOutput = z.infer<typeof RecommendAIShortcutsOutputSchema>;

export async function recommendAiShortcuts(input: RecommendAIShortcutsInput): Promise<RecommendAIShortcutsOutput> {
  const flow = ai.defineFlow(
    {
      name: 'recommendAiShortcutsFlow_inline', // Unique name for this inline flow definition
      inputSchema: RecommendAIShortcutsInputSchema,
      outputSchema: RecommendAIShortcutsOutputSchema,
    },
    async (flowInput: RecommendAIShortcutsInput): Promise<RecommendAIShortcutsOutput> => {
      const {output} = await recommendAiShortcutsPrompt(flowInput);
      if (!output) {
          throw new Error("No output received from AI for recommendations.");
      }
      // Ensure logoUrl has a query param based on taskCategory for picsum
      const processedRecommendations = output.recommendations.map(rec => {
        let logoUrl = rec.logoUrl;
        if (typeof logoUrl === 'string' && logoUrl.startsWith('https://picsum.photos/50/50')) {
          const categoryKeyword = rec.taskCategory.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/gi, '') || 'abstract';
          logoUrl = `https://picsum.photos/50/50?query=${encodeURIComponent(categoryKeyword)}`;
        }
        return { ...rec, logoUrl };
      });

      return { recommendations: processedRecommendations };
    }
  );
  return flow(input);
}

const recommendSystemPrompt = `You are an AI assistant that recommends other AI tools based on a user's query.
Analyze the user's query to understand the primary task they want to accomplish.
Determine the primary task category (e.g., 'Image Generation', 'Code Generation', 'Text Summarization', 'Creative Writing', 'Data Analysis', 'Translation', 'Research', 'Chatbot Interaction').
Based on the identified task category, recommend 1 to 3 suitable and well-known AI tools or models.
For each recommendation, you must provide:
- name: The official name of the AI tool/model.
- logoUrl: A placeholder image URL. Construct this URL as 'https://picsum.photos/50/50?query=KEYWORD' where 'KEYWORD' is a single, relevant, lowercase keyword for the task category (e.g., 'image', 'code', 'text', 'chat', 'research'). This must be a valid URL.
- description: A brief (1-2 sentences) description of what the AI does and its specialization relevant to the user's query.
- websiteUrl: The official website URL for the AI tool/model. If an official URL for a specific model (like GPT-4) is not directly linkable, provide the URL to the platform offering it (e.g., OpenAI's website). This must be a valid URL.
- taskCategory: The identified task category.

Ensure your response strictly adheres to the JSON schema provided for the output.
Prioritize recommending tools from this list if they are relevant to the query: ChatGPT, Gemini, Claude, Poe, Perplexity AI, Leonardo AI.

Example AI tools for categories:
- Image Generation: Leonardo AI, DALL-E 3, Midjourney, Stable Diffusion
- Code Generation: GitHub Copilot, Amazon CodeWhisperer, Tabnine, ChatGPT, Gemini, Claude
- Text Summarization/Creative Writing/Chatbot Interaction: ChatGPT, Gemini, Claude, Poe
- Research/Search: Perplexity AI, Google Gemini, ChatGPT (with browsing)
- Data Analysis: Julius AI, Wolfram Alpha, ChatGPT (Code Interpreter)
- Translation: Google Translate, DeepL, Gemini

User Query: {{{query}}}
`;

const recommendAiShortcutsPrompt = ai.definePrompt({
  name: 'recommendAiShortcutsPrompt',
  input: {schema: RecommendAIShortcutsInputSchema},
  output: {schema: RecommendAIShortcutsOutputSchema},
  prompt: recommendSystemPrompt,
   // Adjust safety settings if needed, though for recommendations it's usually fine.
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
});
