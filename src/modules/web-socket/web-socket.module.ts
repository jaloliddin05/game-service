import { Module } from '@nestjs/common';
import { GameGateway } from './web-socket.gateway';
@Module({
  imports: [],
  providers: [GameGateway],
})
export class GameSocketModule {}
