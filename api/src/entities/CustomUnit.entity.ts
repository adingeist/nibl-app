import { Food } from '@src/entities/Food.entity';
import { decimalTransformer } from '@src/utils/ColumnDecimalTransformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Food)
  food: Food;

  @Column()
  unit: string;

  @Column({ type: 'decimal', transformer: decimalTransformer })
  quantity: number;

  @Column({ name: 'metric_quantity' })
  metricQuantityPerUnit: number;
}
