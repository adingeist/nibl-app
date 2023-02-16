import { auth } from '@src/middleware/auth';
import express, { Request } from 'express';
import { validate } from '@src/middleware/validate';
import { RouteSchemas } from '@src/shared/schemas/routes';
import {
  IDeleteCalendar,
  IDeleteFoodFromCalendarDate,
  IDeleteRecipeFromCalendarDate,
  IGetCalendar,
  IPostCalendar,
  IPostFoodToCalendarDate,
  IPostRecipeToCalendarDate,
  IShareCalendar,
  IUnshareCalendar,
} from '@src/shared/types/routes/calendar.controller';
import { ApiError } from '@src/utils/ApiError';
import { AppDataSource } from '@src/start/db';
import { appRouter } from '@src/utils/appRouter';
import { calendarAuth } from '@src/middleware/calendarAuth';
import { CalendarDateRepository } from '@src/repository/CalendarDate.repository';
import { CalendarDto } from '@src/shared/types/dto/Calendar.entity';
import { CalendarFoodRepository } from '@src/repository/CalendarFood.repository';
import { CalendarRecipeRepository } from '@src/repository/CalendarRecipe.repository';
import { CalendarRepository } from '@src/repository/Calendar.repository';
import { CalendarUserRepository } from '@src/repository/CalendarUser.repository';
import { CalendarUserRoles } from '@src/entities/enums/CalendarUserRole.enum';
import { FoodRepository } from '@src/repository/Food.repository';
import { instanceToPlain } from 'class-transformer';
import { Not } from 'typeorm';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { UserRepository } from '@src/repository/User.repository';

const router = express.Router();

const getDateFromParams = (
  req: Request & { params: { day: string; month: string; year: string } },
) => {
  const day = Number.parseInt(req.params.day);
  const month = Number.parseInt(req.params.month);
  const year = Number.parseInt(req.params.year);
  return new Date(year, month - 1, day);
};

// POST /calendars
appRouter.post<IPostCalendar>(
  '/calendars',
  auth('user'),
  validate(RouteSchemas.postCalendar),
  async (req, res) => {
    const user = await UserRepository.findUserRequestingOrThrow404(req);

    const calendar = CalendarRepository.create({ name: req.body.name });

    const calendarUser = CalendarUserRepository.create({
      calendar,
      role: CalendarUserRoles.OWNER,
      user,
    });

    await AppDataSource.transaction(async (entityManager) => {
      await entityManager.save([calendar, calendarUser]);
    });

    const calendarDto = instanceToPlain(calendar) as CalendarDto;

    res.send({
      id: calendarDto.id,
      name: calendarDto.name,
      createdAt: calendarDto.createdAt,
      updatedAt: calendarDto.updatedAt,
    });
  },
);

// DELETE /calendars/:calendarId
appRouter.delete<IDeleteCalendar>(
  '/calendars/:calendarId',
  auth('user'),
  calendarAuth(CalendarUserRoles.OWNER),
  async (req, res) => {
    const calendarId = req.params.calendarId;

    const calendar = await CalendarRepository.findOneBy({ id: calendarId });

    if (!calendar) {
      throw new ApiError(404, 'Calendar not found');
    }

    if (calendar.isPrimary) {
      throw new ApiError(400, `You can't delete your primary calendar`);
    }

    await CalendarRepository.delete({ id: calendarId });

    res.send({ success: true });
  },
);

// POST /calendars/:calendarId/share
appRouter.post<IShareCalendar>(
  '/calendars/:calendarId/share',
  auth('user'),
  calendarAuth(CalendarUserRoles.OWNER),
  async (req, res) => {
    const calendarId = req.params.calendarId;
    const shareWithId = req.body.userId;
    const role = req.body.canWrite
      ? CalendarUserRoles.EDITOR
      : CalendarUserRoles.READER;

    const calendar = await CalendarRepository.findOneBy({ id: calendarId });

    if (!calendar) {
      throw new ApiError(404, 'Calendar not found');
    }

    const user = await UserRepository.findOneBy({ id: shareWithId });

    if (!user) {
      throw new ApiError(404, 'User to share with not found');
    }

    let newUser = CalendarUserRepository.create({
      calendar,
      role,
      user,
    });

    newUser = await CalendarUserRepository.save(newUser);

    res.send({
      calendarId,
      id: newUser.id,
      role,
      user: {
        id: user.id,
        profileImage: user.profileImage,
        username: user.username,
      },
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    });
  },
);

// DELETE /calendars/:calendarId/unshare
appRouter.delete<IUnshareCalendar>(
  '/calendar/:calendarId/unshare',
  auth('user'),
  calendarAuth(CalendarUserRoles.OWNER),
  async (req, res) => {
    const calendarId = req.params.calendarId;
    const unshareId = req.body.userId;

    const { affected } = await CalendarUserRepository.delete({
      calendar: { id: calendarId },
      user: { id: unshareId },
      role: Not(CalendarUserRoles.OWNER),
    });

    if (!affected) {
      throw new ApiError(404, 'User to unshare with not found');
    }

    res.send({ success: true });
  },
);

// GET /calendars/:id ?month ?year
appRouter.get<IGetCalendar>(
  '/calendars/:id',
  auth('user'),
  validate(RouteSchemas.getCalendarDates),
  async (req, res) => {
    const calendarId = req.params.calendarId;
    const month = Number.parseInt(req.query.month); // 1 - 12
    const year = Number.parseInt(req.query.year);

    const dates = await CalendarDateRepository.getDatesInMonthDto(
      month,
      year,
      calendarId,
    );

    res.send(dates);
  },
);

// POST /calendars/:id/:day/:month/:year/recipes
appRouter.post<IPostRecipeToCalendarDate>(
  '/calendars/:id/:day/:month/:year/recipes',
  auth('user'),
  calendarAuth(CalendarUserRoles.EDITOR, CalendarUserRoles.OWNER),
  async (req, res) => {
    const calendarId = req.params.calendarId;

    const date = getDateFromParams(req);

    const recipeId = req.body.recipeId;
    const servings = req.body.servings;

    const userRequesting = await UserRepository.findUserRequestingOrThrow404(
      req,
    );

    const calendarDate = await CalendarDateRepository.findOneBy({
      calendar: { id: calendarId },
      date,
    });

    if (!calendarDate) {
      throw new ApiError(404, 'Calendar date not found');
    }

    const recipe = await RecipeRepository.findOneBy({ id: recipeId });

    const recipeDto = await RecipeRepository.getFullRecipeDtoOrThrow404(
      recipeId,
      userRequesting,
    );

    if (!recipe) {
      throw new ApiError(404, 'Recipe not found');
    }

    const calendarRecipe = CalendarRecipeRepository.create({
      calendarDate,
      recipe,
      servings,
    });

    await CalendarRecipeRepository.save(calendarRecipe);

    res.send({ calendarId, date: date.toISOString(), recipe: recipeDto });
  },
);

// DELETE /calendars/:calendarId/recipes/:calendarRecipeId
appRouter.delete<IDeleteRecipeFromCalendarDate>(
  '/calendars/:calendarId/recipes/:calendarRecipeId',
  auth('user'),
  calendarAuth(CalendarUserRoles.OWNER, CalendarUserRoles.EDITOR),
  async (req, res) => {
    const calendarRecipeId = req.params.calendarRecipeId;

    await CalendarRecipeRepository.delete({ id: calendarRecipeId });

    res.send({ success: true });
  },
);

// POST /calendars/:id/:day/:month/:year/foods
appRouter.post<IPostFoodToCalendarDate>(
  '/calendars/:id/:day/:month/:year/foods',
  auth('user'),
  calendarAuth(CalendarUserRoles.EDITOR, CalendarUserRoles.OWNER),
  async (req, res) => {
    const calendarId = req.params.calendarId;
    const foodId = req.body.foodId;
    const servingSizeMetricQuantity = req.body.servingSizeMetricQuantity;
    const date = getDateFromParams(req);

    const calendarDate = await CalendarDateRepository.findOneBy({
      calendar: { id: calendarId },
      date,
    });

    if (!calendarDate) {
      throw new ApiError(404, 'Calendar date not found');
    }

    const [food, foodDto] = await FoodRepository.findOneDtoById(foodId);

    if (!food) {
      throw new ApiError(404, 'Food not found');
    }

    const calendarFood = CalendarFoodRepository.create({
      food,
      calendarDate,
      servingSizeMetricQuantity,
    });

    await CalendarFoodRepository.save(calendarFood);

    res.send({
      food: foodDto,
      id: calendarFood.id,
      servingSizeMetricQuantity,
    });
  },
);

// DELETE /calendars/:calendarId/foods/:calendarFoodId
appRouter.delete<IDeleteFoodFromCalendarDate>(
  '/calendars/:calendarId/foods/:calendarFoodId',
  auth('user'),
  calendarAuth(CalendarUserRoles.OWNER, CalendarUserRoles.EDITOR),
  async (req, res) => {
    const calendarFoodId = req.params.calendarFoodId;

    await CalendarFoodRepository.delete({ id: calendarFoodId });

    res.send({ success: true });
  },
);

export default router;
