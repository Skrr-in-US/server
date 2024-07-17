import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column()
  school: string;

  @Column()
  county: string;

  @Column()
  state: string;

  @Column()
  people: number;
}
