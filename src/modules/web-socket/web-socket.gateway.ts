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
  async handleJoinGame(
    @MessageBody()
    data: { userId: string; level: string; name: string; url: string},
    @ConnectedSocket() client: Socket,
  ) {
    const {  userId, level, name, url  } = data;
    
    const room = this.kahootService.joinGame(userId, name, url, level);

    client.join(room.id);
    this.server.to(room.id).emit('user-joined', room);

    if (room.users.length === 2) {
      const quiz = await this.kahootService.generateQuizzes(level, 80);
      this.server.to(room.id).emit('start-game', quiz);
    }
  }

  @SubscribeMessage('left-game')
  async handleLeftGame(
    @MessageBody()
    data: { userId: string; roomId:string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, roomId } = data;

    const room = this.kahootService.leftRoom(roomId,userId);

    client.leave(room.id);
    this.server.to(room.id).emit('user-left', room);
  }

  @SubscribeMessage('request-start-game')
  async startGame(
    @MessageBody() data: { roomId: string; level: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, level } = data;
    const quiz = await this.kahootService.generateQuizzes(level, 80);    
    this.server.to(roomId).emit('start-game', quiz );
  }

  @SubscribeMessage('send-round-results')
  async sendRoundResults({ roomId, id, score, round }, @ConnectedSocket() client: Socket) {
    this.kahootService.changeRoomResult( roomId,id,score,);
  }

  @SubscribeMessage('get-round-results')
  async getRoundResults(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.kahootService.getRoom(data.room);
    this.server.emit('receive-get-round-result', room.result);
  }

  @SubscribeMessage('leave-game')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }
}
