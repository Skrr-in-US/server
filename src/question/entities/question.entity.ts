import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  question: string;

  @Column({ nullable: false })
  summary: string;

  @Column()
  imoji: string;
}
