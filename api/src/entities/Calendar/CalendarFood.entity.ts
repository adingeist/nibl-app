import { CalendarDate } from '@src/entities/Calendar/CalendarDate.entity';
import { Food } from '@src/entities/Food.entity';
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
export class CalendarFood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CalendarDate)
  @JoinColumn({ name: 'calendar_date_id' })
  calendarDate: CalendarDate;

  @ManyToMany(() => Food)
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column({ name: 'serving_size_metric_quantity' })
  servingSizeMetricQuantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
