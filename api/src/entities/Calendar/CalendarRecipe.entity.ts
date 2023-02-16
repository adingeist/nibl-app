import { CalendarDate } from '@src/entities/Calendar/CalendarDate.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CalendarRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CalendarDate)
  @JoinColumn({ name: 'calendar_date_id' })
  calendarDate: CalendarDate;

  @ManyToMany(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column()
  servings: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
