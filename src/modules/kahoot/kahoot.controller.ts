import { Controller, Get, Query } from '@nestjs/common';

import { CreateKahootDto, UpdateKahootDto } from './dto';
import { KahootService } from './kahoot.service';

@Controller('kahoot')
export class KahootController {
  constructor(private readonly kahootService: KahootService) {}

  @Get('')
  async getOne(@Query('lvl') lvl:string,@Query('count') count:string) {
    return await this.kahootService.generateQuizzes(lvl,count);
  }

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
