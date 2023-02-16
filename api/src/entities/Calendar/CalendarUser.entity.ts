import { Calendar } from '@src/entities/Calendar/Calendar.entity';
import { CalendarUserRoles } from '@src/entities/enums/CalendarUserRole.enum';
import { User } from '@src/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Calendar)
  @JoinColumn()
  calendar: Calendar;

  @Column({ type: 'enum', enum: CalendarUserRoles })
  role: CalendarUserRoles;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
