import { yupObjectId } from '@shared/schemas/util.joi';
import { CalendarValidation } from '@shared/validation/calendar.validation';
import * as Yup from 'yup';

export const calendarRouteSchemas = {
  postCalendar: {
    body: Yup.object().shape({
      name: Yup.string()
        .min(CalendarValidation.MIN_NAME_LENGTH)
        .max(CalendarValidation.MAX_NAME_LENGTH)
        .required(),
    }),
  },

  deleteCalendar: {
    params: Yup.object().shape({ calendarId: yupObjectId }),
  },

  shareCalendar: {
    params: Yup.object().shape({
      calendarId: yupObjectId.required(),
    }),
    body: Yup.object().shape({
      userId: yupObjectId.required(),
      canWrite: Yup.boolean().required(),
    }),
  },

  unshareCalendar: {
    params: Yup.object().shape({ calendarId: yupObjectId }),
    body: Yup.object().shape({ userId: yupObjectId }),
  },

  getCalendarDates: {
    params: Yup.object().shape({ calendarId: yupObjectId }),
    query: Yup.object().shape({
      month: Yup.number().integer().min(0).max(11).required(),
    year: Yup.number().integer().min(2000).max(2100).required(),
    }),
  },

  deleteRecipeFromCalendarDate: {
    params: Yup.object().shape({
      calendarId: yupObjectId,
      day: Yup.number().min(1).max(31).required(),
      month: Yup.number().min(1).max(12).required(),
      year: Yup.number().min(2000).max(9999).required(),
      recipeId: yupObjectId.required(),
    }),
  },

  postRecipeToCalendarDate: {
    params: Yup.object().shape({
      calendarId: yupObjectId,
      day: Yup.number().min(1).max(31).required(),
      month: Yup.number().min(1).max(12).required(),
      year: Yup.number().min(2000).max(9999).required(),
    }),
    body: Yup.object().shape({ recipeId: yupObjectId.required() }),
  },
};
