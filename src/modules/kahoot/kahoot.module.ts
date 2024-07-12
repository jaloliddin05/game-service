import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kahoot } from './kahoot.entity';
import { KahootService } from './kahoot.service';
import { KahootController } from './kahoot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kahoot])],
  controllers: [KahootController],
  providers: [KahootService],
  exports: [KahootService],
})
export class KahootModule {}
