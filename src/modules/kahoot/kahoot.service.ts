import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Kahoot } from './kahoot.entity';
import { CreateKahootDto, UpdateKahootDto } from './dto';
import { fetchData } from 'src/infra/helper';

interface Room {
  id: string;
  users: {id:string,name:string,url:string}[];
  level: string;
}

Injectable();
export class KahootService {
  private rooms: Room[] = [];

  constructor(
    @InjectRepository(Kahoot)
    private readonly kahootRepository: Repository<Kahoot>,
  ) {}

  async generateQuizzes(lvl: string, count: number) {
    const words = await this.getRandomWords(lvl, count);
    const quizzes = this.createQuizzes(words);
    return quizzes;
  }

  async getRandomWords(lvl: string, count: number) {
    const data = await fetchData(`
      SELECT word, description
      FROM perfectly_dictionary
      ORDER BY RANDOM()
      LIMIT $1;
      `,
      +count,
    );

    return data;
  }

  createQuizzes(words) {
    const quizzes = [];
    for (let i = 0; i < words.length; i += 4) {
      const questionWords = words.slice(i, i + 4);
      const correctWord = questionWords[Math.floor(Math.random() * 4)];
      quizzes.push({
        question: `What is the translation of "${correctWord.word}"?`,
        options: questionWords.map((w) => w.description),
        correctAnswer: correctWord.description,
      });
    }
    return quizzes;
  }

  async getAll() {}

  async deleteOne(id: string) {
    const response = await this.kahootRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateKahootDto, id: string) {
    const response = await this.kahootRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateKahootDto) {
    const data = this.kahootRepository.create(value);
    return await this.kahootRepository.save(data);
  }

  joinGame(id: string,name:string,url:string, level: string): Room {
    let room = this.rooms.find(r => r.level === level && r.users.length < 5);

    if (!room) {
      room = { id: `${level}-${Date.now()}`, users: [], level };
      this.rooms.push(room);
    }

    room.users.push({id,name,url});

    return room;
  }

  deleteGameRoom(id:string){
    this.rooms = this.rooms.filter(r=> r.id != id)
  }
}
