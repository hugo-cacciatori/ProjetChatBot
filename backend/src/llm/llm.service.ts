import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SYSTEM_PROMPT, url, userPrompt } from './utils';
import { CustomLogger } from '../utils/Logger/CustomLogger.service';

@Injectable()
export class LlmService {
  private readonly logger = new CustomLogger();
  private tokenUsage = 0;

  async request(
    row: any,
    usedKeywords: string[] = [],
  ): Promise<{
    title: string;
    description: string;
    keywords: string[];
  }> {
    const maxTokenUsage = Number(process.env.MAX_TOKEN_USAGE);
    const maxRetries = Number(process.env.MAX_RETRIES);
    const retryDelay = Number(process.env.RETRY_DELAY_MS);

    if (this.tokenUsage >= maxTokenUsage) {
      throw new ServiceUnavailableException('Token usage limit reached');
    }

    let attempt = 0;
    while (attempt < maxRetries) {
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
        console.log('data');
        console.log(data.choices[0].message);
        const content = data.choices[0]?.message?.content;
        if (!content) {
          throw new Error('GPT response content is missing.');
        }

        const usage = data.usage?.total_tokens;
        this.tokenUsage += usage;

        return this.parseResponseContent(content);
      } catch (error) {
        this.logger.warn(
          `LlmService request failed (attempt ${attempt + 1}): + ${error.message}`,
        );
        attempt++;
        if (attempt < maxRetries) {
          await this.delay(retryDelay);
        } else {
          throw new InternalServerErrorException(
            'Llm request failed after retries',
          );
        }
      }
    }
  }

  private parseResponseContent(content: string): {
    title: string;
    description: string;
    keywords: string[];
  } {
    try {
      const parsed = JSON.parse(content);
      const { title, description, keywords } = parsed;
      return { title, description, keywords };
    } catch (error) {
      console.error('Failed to parse GPT JSON response:', content);
      throw new InternalServerErrorException(
        'Invalid JSON response from GPT :',
        error,
      );
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
