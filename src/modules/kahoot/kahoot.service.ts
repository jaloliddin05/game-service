import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Kahoot } from './kahoot.entity';
import { fetchData } from 'src/infra/helper';

interface Room {
  id: string;
  users: { id: string; name: string; url: string }[];
  level: string;
  date: Date;
  result: {
    id: string;
    score: number;
  }[];
  currentResult?: any
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

  async getAll() {}

  async deleteOne(id: string) {
    const response = await this.kahootRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value, id: string) {
    const response = await this.kahootRepository.update({ id }, value);
    return response;
  }

  async create(value:Room) {
    const players = value.users.map(u=>u.id)
    const result = []
    value.result.forEach((r,i)=>{
       result.push({
        id: r.id,
        score:r.score,
        name: value.users[i].name,
        url:value.users[i].url,
        win:r.score > 15
       })
    })

    const data = this.kahootRepository.create({players,result});
    return await this.kahootRepository.save(data);
  }

  joinGame(id: string, name: string, url: string, level: string): Room {
    let room = this.rooms.find((r) => r.level === level && r.users.length < 5);

    if (!room) {
      room = {
        id: `${level}-${Date.now()}`,
        users: [],
        level,
        result: [],
        date: new Date(),
      };
      this.rooms.push(room);
    }

    room.users.push({ id, name, url });
    room.result.push({ id, score: 0 });
    room.currentResult = {}

    return room;
  }

  changeRoomResult(roomId: string, id: string, score: number) {
    const room = this.rooms.find((r) => r.id == roomId);
    room.result.find((r) => r.id == id).score += score;
    room.currentResult[id] = score
    return room;
  }

  getRoom(roomId: string) {
    return  this.rooms.find((r) => r.id == roomId)
  }

  leftRoom(roomId:string,userId:string){    
    const room = this.rooms.find((r) => r.id == roomId);
    if(!room) return
    room.users = room.users.filter(u=>u.id != userId)
    room.result = room.result.filter(r=>r.id != userId)
    return room
  }

  deleteGameRoom(id: string) {
    this.rooms = this.rooms.filter((r) => r.id != id);
  }
}
