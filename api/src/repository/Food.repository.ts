import { Food } from '@src/entities/Food.entity';
import { FoodDtoType } from '@src/shared/types/dto/Food.entity';
import { AppDataSource } from '@src/start/db';
import { ILike } from 'typeorm';

export const FoodRepository = AppDataSource.getRepository(Food).extend({
  async findOneDtoById(
    id: string,
  ): Promise<[Food, FoodDtoType] | [null, null]> {
    const food = await this.findOne({
      where: { id },
      relations: {
        brand: true,
        nutrients: true,
        customUnits: true,
      },
    });

    if (!food) return [null, null];

    const foodDto: FoodDtoType = {
      id: food.id,
      name: food.name,
      brand: food.brand
        ? {
            ...food.brand,
            createdAt: food.brand.createdAt.toISOString(),
            updatedAt: food.brand.updatedAt.toISOString(),
          }
        : null,
      nutrients: food.nutrients,
      servingSizeMetricQuantity: food.servingSizeMetricQuantity,
      servingSizeMetricUnit: food.servingSizeMetricUnit,
      supportedUnits: food.supportedUnits,
      createdAt: food.createdAt.toISOString(),
      updatedAt: food.updatedAt.toISOString(),
      density: food.density ? food.density : undefined,
      image: food.image,
    };

    return [food, foodDto];
  },

  search(str: string, page: number) {
    const take = 10;
    const skip = page * take;

    return this.findAndCount({
      where: { name: ILike(`%${str}%`) },
      skip,
      take,
      relations: {
        brand: true,
        nutrients: true,
        customUnits: true,
      },
    });
  },
});
