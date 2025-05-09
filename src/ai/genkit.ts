
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey) {
  console.warn(
    'GOOGLE_API_KEY is not set. Please add it to your .env file for Gemini AI to function properly.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: googleApiKey,
    }),
  ],
  // Default model for all flows, can be overridden per flow/prompt
  model: 'googleai/gemini-2.0-flash', 
});
