import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Kahoot } from './kahoot.entity';
import { CreateKahootDto, UpdateKahootDto } from './dto';
import { fetchData } from 'src/infra/helper';

Injectable();
export class KahootService {
  constructor(
    @InjectRepository(Kahoot)
    private readonly kahootRepository: Repository<Kahoot>,
  ) {}

  async generateQuizzes(lvl: string, count: string) {
    const words = await this.getRandomWords(lvl, count);
    const quizzes = this.createQuizzes(words);
    return quizzes;
  }

  async getRandomWords(lvl: string, count: string) {
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
}
