import { genderType } from 'src/user/entities/enum/genderEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  receiveUser: number;

  @Column({ nullable: false })
  sendUser: number;

  @Column()
  summary: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'enum', enum: genderType })
  gender: genderType;
}
