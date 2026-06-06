import { injectable } from 'tsyringe';
import { JsonController, Post, Get, Body, QueryParam } from 'routing-controllers';
import { ChatService } from '../services/chat.service';
import { ChatRequest } from '../contracts/chat-message.interface';

@injectable()
@JsonController('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  postChat(@Body() body: ChatRequest) {
    console.log('Received message:', body.message);
    const response = this.chatService.chat(body);
    return response;
  }
}
