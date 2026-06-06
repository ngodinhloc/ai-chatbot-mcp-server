import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Skill } from './skill.entity';
import { Qualification } from './qualification.entity';
import { Experience } from './experience.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @OneToMany(() => Skill, (skill) => skill.user, { cascade: true })
  skills: Skill[];

  @OneToMany(() => Qualification, (q) => q.user, { cascade: true })
  qualifications: Qualification[];

  @OneToMany(() => Experience, (e) => e.user, { cascade: true })
  experiences: Experience[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
