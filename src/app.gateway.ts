import { WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class AppGateway {}
