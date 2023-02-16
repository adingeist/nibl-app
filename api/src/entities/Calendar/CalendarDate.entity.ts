import { Calendar } from '@src/entities/Calendar/Calendar.entity';
import { CalendarFood } from '@src/entities/Calendar/CalendarFood.entity';
import { CalendarRecipe } from '@src/entities/Calendar/CalendarRecipe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Calendar)
  @JoinColumn({ name: 'calendar_id' })
  calendar: Calendar;

  @ManyToMany(() => CalendarRecipe)
  @JoinColumn()
  calendarRecipes: CalendarRecipe[];

  @ManyToMany(() => CalendarDate)
  @JoinColumn()
  calendarFoods: CalendarFood[];

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
