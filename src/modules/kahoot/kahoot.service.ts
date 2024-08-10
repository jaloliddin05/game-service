import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Kahoot } from './entities/kahoot.entity';
import { fetchData } from 'src/infra/helper';
import { KahootRating } from './entities/kahoot-rating.entity';

interface Room {
  id: string;
  users: { id: string; name: string; url: string }[];
  level: string;
  date: Date;
  result: {
    id: string;
    score: number;
    time:number
  }[];
  currentResult?: any;
  isStarted: boolean;
  range:number
}
Injectable();
export class KahootService {
  private rooms: Room[] = [];

  constructor(
    @InjectRepository(Kahoot)
    private readonly kahootRepository: Repository<Kahoot>,
    @InjectRepository(KahootRating)
    private readonly kahootRatingRepository: Repository<KahootRating>,
  ) {}

  async getUserKahoot(user:string){
    console.log(user);
    
    const data = await this.kahootRatingRepository.findOne({
      where:{user}
    })

    if(data) return data

    const newData = this.kahootRatingRepository.create({user})
    return await this.kahootRatingRepository.save(newData)
  }

  async create(value: Room) {
    const players = value.users.map((u) => u.id);
    const result = [];
    await Promise.all(
      value.result.map(async (r, i) => {
        result.push({
          id: r.id,
          score: r.score,
          name: value.users[i].name,
          url: value.users[i].url,
          win: r.score > 15,
        });
      }),
    );

    const data = this.kahootRepository.create({ players, result });
    await this.kahootRepository.save(data);
    await this.changeRating(value.result)
  }
  async changeRating(data: { id: string; score: number; time: number }[]) {
    const ballMap = {
      20: 5, 19: 4, 18: 3, 17: 2, 16: 1,
      15: 0, 14: -1, 13: -2, 12: -3, 11: -4,
      10: -5, 9: -5, 8: -5, 7: -5, 6: -5,
      5: -5, 4: -5, 3: -5, 2: -5, 1: -5,
    };

    data.sort((a, b) => b.score - a.score || a.time - b.time);

    await Promise.all(
      data.map(async (d, i) => {
        if (i < 3) {
          //..... rating
        }
        await this.kahootRatingRepository
          .createQueryBuilder()
          .update(KahootRating)
          .set({ xp: () => `xp + ${ballMap[d.score]}` })
          .where('user = :user', { user: d.id })
          .execute();
      }),
    );
  }
  //--------------------------------------------------------

  async generateQuizzes(lvl: string, count: number) {
    const words = await this.getRandomWords(lvl, count);
    const quizzes = this.createQuizzes(words);
    return quizzes;
  }

  async getRandomWords(lvl: string, count: number) {
    const data = await fetchData(
      `
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

  joinGame(id: string, name: string, url: string, level: string,range:number): Room {
    let room = this.rooms.find(
      (r) => r.level === level && r.users.length < 5 && !r.isStarted && (r.range - 50 < range && r.range + 50 > range)
    );

    if (!room) {
      room = {
        id: `${level}-${Date.now()}`,
        users: [],
        level,
        result: [],
        date: new Date(),
        isStarted: false,
        range
      };
      this.rooms.push(room);
    }

    room.users.push({ id, name, url });
    room.result.push({ id, score: 0,time:0 });
    room.currentResult = {};

    return room;
  }

  changeRoomResult(roomId: string, userId: string, score: number,time:number,word:string) {
    const room = this.rooms.find((r) => r.id == roomId);
    const result = room.result.find((r) => r.id == userId)
    result.score += score;
    result.time += time;
    room.currentResult[userId] = { score, word }
    return room;
  }

  startGame(roomId: string) {
    const room = this.rooms.find((r) => r.id == roomId);
    room.isStarted = true;
    return room;
  }

  getRoom(roomId: string) {
    return this.rooms.find((r) => r.id == roomId);
  }

  leftRoom(roomId: string, userId: string) {
    const room = this.rooms.find((r) => r.id == roomId);
    if (!room) return;
    room.users = room.users.filter((u) => u.id != userId);
    room.result = room.result.filter((r) => r.id != userId);
    return room;
  }

  deleteGameRoom(id: string) {
    this.rooms = this.rooms.filter((r) => r.id != id);
  }
}
