import { initClaudeService } from '../services/claudeService';
import { initOpenAIService } from '../services/openaiService';

// Initialize environment variables
export const initializeEnv = () => {
  const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  // Validate API keys
  if (!CLAUDE_API_KEY) {
    console.error('Missing EXPO_PUBLIC_CLAUDE_API_KEY in .env');
  }
  if (!OPENAI_API_KEY) {
    console.error('Missing EXPO_PUBLIC_OPENAI_API_KEY in .env');
    throw new Error('OPENAI_API_KEY is required in environment variables');
  }

  // Initialize AI services
  initClaudeService(CLAUDE_API_KEY);
  initOpenAIService(OPENAI_API_KEY);
};
