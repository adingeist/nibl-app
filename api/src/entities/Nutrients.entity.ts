import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { decimalTransformer } from '@src/utils/ColumnDecimalTransformer';

@Entity()
export class Nutrients {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  calories: number;

  @Column({
    name: 'total_fat',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  totalFat: number;

  @Column({
    name: 'trans_fat',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  transFat: number;

  @Column({
    name: 'saturated_fat',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  saturatedFat: number;

  @Column({
    name: 'polyunsaturated_fat',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  polyunsaturatedFat: number;

  @Column({
    name: 'monounsaturated_fat',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  monounsaturatedFat: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  cholesterol: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  sodium: number;

  @Column({
    name: 'total_carbohydrates',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  totalCarbohydrates: number;

  @Column({
    name: 'dietary_fiber',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  dietaryFiber: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  sugars: number;

  @Column({
    name: 'added_sugars',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  addedSugars: number;

  @Column({
    name: 'sugar_alcohol',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  sugarAlcohol: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  protein: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  calcium: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  iron: number;

  @Column({
    name: 'vitamin_d',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminD: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  potassium: number;

  @Column({
    name: 'vitamin_a',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminA: number;

  @Column({
    name: 'vitamin_c',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminC: number;

  @Column({
    name: 'vitamin_e',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminE: number;

  @Column({
    name: 'vitamin_k',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminK: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  thiamin: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  riboflavin: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  niacin: number;

  @Column({
    name: 'vitamin_b6',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminB6: number;

  @Column({
    name: 'folic_acid',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  folicAcid: number;

  @Column({
    name: 'vitamin_b12',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  vitaminB12: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  biotin: number;

  @Column({
    name: 'pantothenic_acid',
    default: 0,
    type: 'decimal',
    transformer: decimalTransformer,
  })
  pantothenicAcid: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  phosphorus: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  iodine: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  magnesium: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  zinc: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  selenium: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  copper: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  manganese: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  chromium: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  molybdenum: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  chloride: number;

  @Column({ default: 0, type: 'decimal', transformer: decimalTransformer })
  caffeine: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
