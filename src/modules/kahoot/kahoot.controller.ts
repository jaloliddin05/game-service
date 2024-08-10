import { Controller, Get, Param } from '@nestjs/common';

import { KahootService } from './kahoot.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('kahoot')
export class KahootController {
  constructor(private readonly kahootService: KahootService) {}


  @Get('/:user')
  async getUserKahoot(@Param('user') user:string){
    return await this.kahootService.getUserKahoot(user)
  }

  // @MessagePattern({ cmd: 'game_kahoot_get_quiz' })
  // async getQuiz() {
    // return await this.kahootService.generateQuizzes(lvl,count);
  // }

  // async saveData() {
    // return await this.kahootService.create(data);
  // }
  // async changeData() {
    // return await this.kahootService.change(data, id);
  // }

  // async deleteData() {
    // return await this.kahootService.deleteOne(id);
  // }
}
