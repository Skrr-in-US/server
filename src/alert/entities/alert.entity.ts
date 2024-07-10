import { genderType } from 'src/user/entities/enum/genderEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  receiveUser: number;

  @Column({ nullable: false })
  receiveUserName: string;

  @Column({ nullable: false })
  sendUser: number;

  @Column({ nullable: false })
  sendUserName: string;

  @Column({ nullable: false })
  sendUserGrade: number;

  @Column()
  question: string;

  @Column()
  summary: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'enum', enum: genderType })
  gender: genderType;

  @Column({ default: false })
  paid: boolean;
}
