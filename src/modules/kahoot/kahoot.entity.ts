import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kahoot')
export class Kahoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
