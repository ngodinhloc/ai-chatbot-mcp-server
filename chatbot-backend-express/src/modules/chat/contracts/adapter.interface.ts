import { LlmChatRequest, LlmResponse } from './chat-message.interface';

export interface AdapterInterface {
  ask(request: LlmChatRequest): Promise<LlmResponse>;
}
