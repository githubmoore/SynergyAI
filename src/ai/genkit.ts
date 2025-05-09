
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. Please add it to your .env file. Please add it to your .env file. Using a placeholder key for now.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey || "AIzaSyC3Bcxyz6QJ4MvS9J72-p1zOpPOHPw-qyY", // Use placeholder if not set
    }),
  ],
  // Default model for all flows, can be overridden per flow/prompt
  model: 'googleai/gemini-1.5-flash-latest', // Changed to a more standard model
});

