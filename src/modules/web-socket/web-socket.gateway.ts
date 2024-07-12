import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  rooms:{id:number,size:number}[] = []
  constructor() {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized!');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.server.to(client.id).emit('message', 'you connected successfully');
  }

  handleDisconnect(client: any) {
    this.server.to(client.id).emit('message', 'you disconnected successfully');
  }

  @SubscribeMessage('join-game')
  handleJoinRoom(client: Socket, room: string) {
    if(this.rooms[this.rooms.length - 1]?.size && this.rooms[this.rooms.length - 1]?.size < 5){
      client.join(`kahoot${this.rooms[this.rooms.length - 1]?.id}`)
    }else{
     this.rooms.push({
      id: this.rooms[this.rooms.length - 1].id + 1,
      size:1
     })
    }
    client.join(room);
  }

  @SubscribeMessage('leave-game')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }
}
