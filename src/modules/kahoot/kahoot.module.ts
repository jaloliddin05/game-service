import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Kahoot } from './entities/kahoot.entity';
import { KahootService } from './kahoot.service';
import { KahootController } from './kahoot.controller';
import { KahootRating } from './entities/kahoot-rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kahoot,KahootRating])],
  controllers: [KahootController],
  providers: [KahootService],
  exports: [KahootService],
})
export class KahootModule {}
