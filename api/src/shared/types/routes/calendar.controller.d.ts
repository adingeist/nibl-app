import { CalendarDto } from '@src/shared/types/dto/Calendar.entity';
import {
  CalendarDateDto,
  CalendarFoodDto,
} from '@src/shared/types/dto/CalendarDate.entity';
import { CalendarUserDto } from '@src/shared/types/dto/CalendarUser.entity';
import { BaseRecipeDto } from '@src/shared/types/dto/Recipe.entity';

export interface IGetCalendar {
  params: { calendarId: string };
  res: CalendarDateDto[];
  body: { name: string };
  query: { month: string; year: string };
}

export interface IPostCalendar {
  params: never;
  res: CalendarDto;
  body: { name: string };
  query: never;
}

export interface IDeleteCalendar {
  params: { calendarId: string };
  res: { success: boolean };
  body: never;
  query: never;
}

export interface IShareCalendar {
  params: { calendarId: string };
  res: CalendarUserDto;
  body: { userId: string; canWrite: boolean };
  query: never;
}

export interface IUnshareCalendar {
  params: { calendarId: string };
  res: { success: boolean };
  body: { userId: string };
  query: never;
}

export interface IPostRecipeToCalendarDate {
  params: {
    calendarId: string;
    day: string;
    month: string;
    year: string;
  };
  res: {
    calendarId: string;
    date: string;
    recipe: BaseRecipeDto;
  };
  body: { recipeId: string; servings: number };
  query: never;
}

export interface IDeleteRecipeFromCalendarDate {
  params: { calendarId: string; calendarRecipeId: string };
  res: { success: boolean };
  body: never;
  query: never;
}

export interface IPostFoodToCalendarDate {
  params: {
    calendarId: string;
    day: string;
    month: string;
    year: string;
  };
  res: CalendarFoodDto;
  body: { foodId: string; servingSizeMetricQuantity: number };
  query: never;
}

export interface IDeleteFoodFromCalendarDate {
  params: { calendarId: string; calendarFoodId: string };
  res: { success: boolean };
  body: never;
  query: never;
}
