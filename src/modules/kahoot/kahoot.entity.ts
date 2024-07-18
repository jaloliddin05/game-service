import JsonColumn from 'src/infra/transformer/text-json.transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kahoot')
export class Kahoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date:string

  @Column("text", { array: true })
  players:string[]

  @Column({ type: 'text', transformer: new JsonColumn(), nullable: true })
  result: {
    id:string,
    score:number,
    name:string,
    url:string,
    win:boolean
  }[]
}
