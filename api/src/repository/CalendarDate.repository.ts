import { Brand } from '@src/entities/Brand.entity';
import { Calendar } from '@src/entities/Calendar/Calendar.entity';
import { CalendarDate } from '@src/entities/CalendarDate.entity';
import { CalendarFood } from '@src/entities/CalendarFood.entity';
import { CalendarRecipe } from '@src/entities/CalendarRecipe.entity';
import { CustomUnit } from '@src/entities/CustomUnit.entity';
import { Food } from '@src/entities/Food.entity';
import { Nutrients } from '@src/entities/Nutrients.entity';
import { Post } from '@src/entities/Post.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import { User } from '@src/entities/User.entity';
import { CalendarDateDto } from '@src/shared/types/dto/CalendarDate.entity';
import { AppDataSource } from '@src/start/db';
import { instanceToPlain } from 'class-transformer';

export const CalendarDateRepository = AppDataSource.getRepository(
  CalendarDate,
).extend({
  async getDatesInMonthDto(month: number, year: number, calId: string) {
    const start = new Date(year, month - 1);
    const end = new Date(year, month, 1, 0, 0, 0, -1);

    const dates = await this.createQueryBuilder('d')
      .leftJoin(Calendar, 'c')
      .where('c.id = :calId', { calId })
      .andWhere('d.date >= :start', { start })
      .andWhere('d.date <= :end', { end })
      // get foods on date
      .leftJoinAndMapMany('d.calendarFoods', CalendarFood, 'calf')
      .leftJoinAndMapMany('calf.food', Food, 'f')
      .leftJoinAndMapMany('f.brand', Brand, 'b')
      .leftJoinAndMapMany('f.nutrients', Nutrients, 'n')
      .leftJoinAndMapMany('f.customUnits', CustomUnit, 'cu')
      // get recipes on date
      .leftJoinAndMapMany('d.calendarRecipes', CalendarRecipe, 'calr')
      .leftJoinAndMapMany('calr.recipes', Recipe, 'r')
      .innerJoinAndMapOne('r.post', Post, 'p', 'p.id = r.post_id')
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'postedBy',
        'p.posted_by_id = postedBy.id',
      )
      .leftJoinAndMapOne(
        'r.nutrients',
        Nutrients,
        'nutrients',
        'r.nutrients_id = nutrients.id',
      )
      .leftJoinAndMapMany('r.ingredients', 'r.ingredients', 'ingredients')
      .leftJoinAndMapOne('ingredients.food', 'ingredients.food', 'food')
      .leftJoinAndMapOne('food.brand', 'food.brand', 'brand')
      .leftJoinAndMapMany('r.directions', 'r.directions', 'directions')
      .loadRelationCountAndMap('r.nibCount', 'r.nibs')
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .getMany();

    const datesDto = instanceToPlain(dates) as CalendarDateDto[];

    return datesDto;
  },
});
