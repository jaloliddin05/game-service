import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { KahootService } from '../kahoot/kahoot.service';

@WebSocketGateway(3004)
export class GameGateway implements OnGatewayInit {
  constructor(private readonly kahootService: KahootService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized!');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.id);
    
    this.server.to(client.id).emit('message', 'you connected successfully');
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage('join-game')
  async handleJoinGame(@MessageBody() data: { userId: string; level: string,name:string,url:string }, @ConnectedSocket() client: Socket) {
    const { userId, level,name,url } = data;
    
    const room = this.kahootService.joinGame(userId,name,url, level);
    
    client.join(room.id);
    this.server.to(room.id).emit('user-joined', room);

    if (room.users.length === 2) {
      const quiz = await this.kahootService.generateQuizzes(level,20)   
      this.server.to(room.id).emit('start-game',{quiz,room: room.id});
    }
  }

  @SubscribeMessage('leave-game')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }
}
