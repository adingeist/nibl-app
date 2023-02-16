import { Brand } from '@src/entities/Brand.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type, Expose, Exclude } from 'class-transformer';
import { storageService } from '@src/services/Storage.service';
import { CustomUnit } from '@src/entities/CustomUnit.entity';
import { decimalTransformer } from '@src/utils/ColumnDecimalTransformer';
import { NutritionMetricUnit } from '@src/entities/enums/NutritionMetricUnit.enum';
import { allMassTypes, allVolumeTypes } from 'easy-cook/dist/convert';
import { EasyCook } from 'easy-cook';
import { Nutrients } from '@src/entities/Nutrients.entity';
import { FoodDtoType } from '@shared/types/dto/Food.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => Nutrients)
  @OneToOne(() => Nutrients, { cascade: true, nullable: false })
  @JoinColumn({ name: 'nutrients_id' })
  nutrients: Nutrients;

  @Type(() => Brand)
  @ManyToOne(() => Brand, { cascade: true, nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand | null;

  @Column()
  name: string;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'image_key', type: 'varchar', nullable: true })
  imageKey: string | null;

  @OneToMany(() => CustomUnit, (customUnit) => customUnit.food, {
    eager: true,
    cascade: true,
  })
  customUnits: CustomUnit[];

  @Column({
    name: 'serving_size_metric_quantity',
    type: 'decimal',
    transformer: decimalTransformer,
  })
  servingSizeMetricQuantity: number;

  @Column({
    name: 'serving_size_metric_unit',
    type: 'enum',
    enum: NutritionMetricUnit,
  })
  servingSizeMetricUnit: NutritionMetricUnit;

  @Column({ type: 'decimal', nullable: true, transformer: decimalTransformer })
  density: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Expose()
  public get image() {
    if (!this.imageKey) return;
    return storageService.keyToUri(this.imageKey);
  }

  @Expose()
  public get supportedUnits(): FoodDtoType['supportedUnits'] {
    const customUnits = this.customUnits
      ? this.customUnits.map((custom) => ({
          unit: custom.unit,
          metricQuantityPerUnit: custom.metricQuantityPerUnit,
          quantity: custom.quantity,
        }))
      : [];

    if (this.density) {
      return [
        ...customUnits,
        ...EasyCook.allMassTypes,
        ...EasyCook.allVolumeTypes,
      ];
    } else if (this.servingSizeMetricUnit === NutritionMetricUnit.GRAMS) {
      return [...customUnits, ...allMassTypes];
    } else if (this.servingSizeMetricUnit === NutritionMetricUnit.MILLILITER) {
      return [...customUnits, ...allVolumeTypes];
    } else {
      return customUnits;
    }
  }
}
