import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;

export const initClaudeService = (apiKey: string) => {
  anthropic = new Anthropic({
    apiKey,
  });
};

export const extractTasksFromImage = async (base64Image: string): Promise<{ title: string; priority: 'none' | 'low' | 'medium' | 'high' | 'urgent' }[]> => {
  console.log('[Claude] Base64 image size:', base64Image.length, 'characters');
  if (!anthropic) throw new Error('Claude service not initialized');

  const startTime = Date.now();
  console.log('[Claude] Starting API request...');
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this handwritten todo list and extract active tasks. Rules:\n1. Ignore any titles (like "To Do", "Tasks", "List", etc)\n2. Skip any crossed-out or strikethrough items\n3. Extract only actionable tasks\n4. Set priority based on visual cues (underlining = high, exclamation marks = urgent)\n\nRespond with ONLY a JSON array. Format: [{"title":"buy milk","priority":"low"}]. Priority levels: none, low, medium, high, urgent.'
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    });

    const apiTime = Date.now() - startTime;
    console.log('[Claude] API request completed in', apiTime, 'ms');
    const response = message.content[0].text;
    console.log('[Claude] Raw response:', response);
    console.log('[Claude] Parsing response...');
    const tasks = JSON.parse(response) as { title: string; priority: 'none' | 'low' | 'medium' | 'high' | 'urgent' }[];
    console.log('[Claude] Successfully parsed', tasks.length, 'tasks');
    console.log('[Claude] Total processing time:', Date.now() - startTime, 'ms');
    return tasks;
  } catch (error) {
    console.error('Error processing image with Claude:', error);
    if (error instanceof SyntaxError) {
      console.error('[Claude] Invalid JSON response. Raw response:', message?.content[0].text);
    }
    throw error;
  }
};
