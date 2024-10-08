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
    data: { userId: string; level: string; name: string; url: string,range:number},
    @ConnectedSocket() client: Socket,
  ) {
    console.log('join-game',data);
    
    const {  userId, level, name, url,range  } = data;
    
    const room = this.kahootService.joinGame(userId, name, url, level,range);

    client.join(room.id);
    this.server.to(room.id).emit('user-joined', room);

    if (room.users.length === 2) {
      this.kahootService.startGame(room.id)
      const quiz = await this.kahootService.generateQuizzes(level, 20);
      this.server.to(room.id).emit('start-game', quiz);
    }
  }

  @SubscribeMessage('left-room')
  async handleLeftGame(
    @MessageBody()
    data: { userId: string; roomId:string },
    @ConnectedSocket() client: Socket,
  ) {    
    console.log('left-room',data);
    
    const { userId, roomId } = data;
    
    const room = this.kahootService.leftRoom(roomId,userId);

    client.leave(roomId);
    this.server.to(room.id).emit('user-left', room);
  }

  @SubscribeMessage('left-game')
  async handleLeftRoom(
    @MessageBody() data: {  roomId:string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('left-game',data);
    
    client.leave(data.roomId);
  }

  @SubscribeMessage('request-start-game')
  async startGame(
    @MessageBody() data: { roomId: string; level: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('request-start-game',data);
    
    const { roomId, level } = data;
    this.kahootService.startGame(roomId)
    const quiz = await this.kahootService.generateQuizzes(level, 20);     
      
    this.server.to(roomId).emit('start-game', quiz )
  }

  @SubscribeMessage('send-round-result')
  async sendRoundResults(@MessageBody() { roomId, userId, score,word,time }, @ConnectedSocket() client: Socket) {   
    console.log('send-round-result',{ roomId, userId, score,word,time });
    this.kahootService.changeRoomResult( roomId,userId,score,time,word);
  }

  @SubscribeMessage('get-round-result')
  async getRoundResults(
    @MessageBody() data: { roomId: string,lastRound:boolean,correctAnswer:string },
    @ConnectedSocket() client: Socket
  ) {    
    console.log('get-round-result',data)
    
    const room = this.kahootService.getRoom(data.roomId)
    console.log(room.currentResult);
    
    this.server.to(data.roomId).emit('receive-get-round-result', {data:room.currentResult,correctAnswer:data.correctAnswer});
    if(data.lastRound){
      const room = this.kahootService.getRoom(data.roomId)
      const res = await this.kahootService.create(room)
      this.server.to(data.roomId).emit("game-result",res)
      this.kahootService.deleteGameRoom(data.roomId)
    }
  }

}
