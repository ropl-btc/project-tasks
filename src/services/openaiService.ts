import OpenAI from 'openai';

let openai: OpenAI | null = null;

export const initOpenAIService = (apiKey: string) => {
  console.log('[OpenAI] Initializing service...');
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Required for Expo/React Native
  });
  console.log('[OpenAI] Service initialized');
};

export const extractTasksFromImage = async (base64Image: string): Promise<{ title: string; priority: 'none' | 'low' | 'medium' | 'high' | 'urgent' }[]> => {
  console.log('[OpenAI] Base64 image size:', base64Image.length, 'characters');
  if (!openai) throw new Error('OpenAI service not initialized');

  const startTime = Date.now();
  console.log('[OpenAI] Starting API request...');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      temperature: 0, // More deterministic responses
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this handwritten todo list and extract active tasks. Rules:\n1. Ignore any titles (like "To Do", "Tasks", "List", etc)\n2. Skip any crossed-out or strikethrough items\n3. Extract only actionable tasks\n4. Set priority based on visual cues (underlining = high, exclamation marks = urgent)\n\nRespond with ONLY a JSON array. Format: [{"title":"buy milk","priority":"low"}]. Priority levels: none, low, medium, high, urgent.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const apiTime = Date.now() - startTime;
    console.log('[OpenAI] API request completed in', apiTime, 'ms');
    
    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('[OpenAI] Raw response:', responseText);
    console.log('[OpenAI] Parsing response...');
    
    // Clean up markdown code blocks if present
    const jsonText = responseText.replace(/```json\n/g, '').replace(/```/g, '').trim();
    console.log('[OpenAI] Cleaned response:', jsonText);
    
    const tasks = JSON.parse(jsonText) as { title: string; priority: 'none' | 'low' | 'medium' | 'high' | 'urgent' }[];
    console.log('[OpenAI] Successfully parsed', tasks.length, 'tasks');
    console.log('[OpenAI] Total processing time:', Date.now() - startTime, 'ms');
    return tasks;
  } catch (error) {
    console.error('Error processing image with OpenAI:', error);
    if (error instanceof SyntaxError) {
      console.error('[OpenAI] Invalid JSON response. Raw response:', error.message);
    }
    throw error;
  }
};
