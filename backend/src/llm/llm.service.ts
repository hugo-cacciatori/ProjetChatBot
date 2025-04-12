import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SYSTEM_PROMPT, url, userPrompt } from './utils';

@Injectable()
export class LlmService {
  async request(
    row: any,
    usedKeywords: string[] = [],
  ): Promise<{
    title: string;
    description: string;
    keywords: string[];
  }> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt(row, usedKeywords) },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('OpenAI error response:', errorBody);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('LlmService error:', error);
      throw new InternalServerErrorException('Llm request failed');
    }
  }
}
