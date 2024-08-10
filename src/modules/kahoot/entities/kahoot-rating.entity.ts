import { Column, Entity } from 'typeorm';

@Entity('kahoot_rating')
export class KahootRating {
  @Column({type:"varchar", primary:true})
  user:string

  @Column({type:"int", default:0})
  xp:number
}
