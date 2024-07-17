import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  content: string;
}
