import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { genderType } from './enum/genderEnum';
import { userType } from './enum/userEnum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  school: string;

  @Column({ nullable: false })
  grade: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'enum', enum: genderType, nullable: false })
  gender: genderType;

  @Column({ type: 'enum', enum: userType, default: userType.USER })
  role: userType;

  @Column({ type: 'varchar', length: 50, nullable: false })
  birth: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
