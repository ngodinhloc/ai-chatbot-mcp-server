import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prompt, GetPromptResult } from '@modelcontextprotocol/sdk/types.js';

@Injectable()
export class PromptsService {
  private readonly logger = new Logger(PromptsService.name);

  async listPrompts(): Promise<Prompt[]> {
    return [
      {
        name: 'summarize',
        description: 'Summarizes the provided text',
        arguments: [
          {
            name: 'text',
            description: 'The text to summarize',
            required: true,
          },
        ],
      },
    ];
  }

  async getPrompt(
    name: string,
    args: Record<string, string> = {},
  ): Promise<GetPromptResult> {
    this.logger.debug(`Getting prompt: ${name}`);

    switch (name) {
      case 'summarize':
        return {
          description: 'Summarize the provided text',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Please summarize the following text:\n\n${args.text}`,
              },
            },
          ],
        };

      default:
        throw new NotFoundException(`Prompt not found: ${name}`);
    }
  }
}
