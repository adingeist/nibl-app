import { Recipe } from '@src/entities/Recipe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { Expose, Exclude } from 'class-transformer';
import { storageService } from '@src/services/Storage.service';

@Entity()
export class Direction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => Recipe)
  @ManyToOne(() => Recipe, (recipe) => recipe.directions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column()
  body: string;

  @Column({ name: 'step_number', type: 'int' })
  stepNumber: number;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'image_key', nullable: true, type: 'varchar' })
  imageKey: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Expose()
  public get image() {
    if (!this.imageKey) return undefined;
    return storageService.keyToUri(this.imageKey);
  }
}
