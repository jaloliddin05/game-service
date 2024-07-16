import { Module } from '@nestjs/common';
import { GameGateway } from './web-socket.gateway';
import { KahootModule } from '../kahoot/kahoot.module';
@Module({
  imports: [KahootModule],
  providers: [GameGateway],
})
export class GameSocketModule {}
