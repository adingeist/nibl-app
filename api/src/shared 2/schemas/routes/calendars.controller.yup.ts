import { yupObjectId } from '@shared/schemas/util.joi';
import { CalendarValidation } from '@shared/validation/calendar.validation';
import * as Yup from 'yup';

export const calendarRouteSchemas = {
  postCalendar: {
    body: {
      name: Yup.string()
        .min(CalendarValidation.MIN_NAME_LENGTH)
        .max(CalendarValidation.MAX_NAME_LENGTH)
        .required(),
    },
  },

  deleteCalendar: {
    params: { calendarId: yupObjectId },
  },

  shareCalendar: {
    params: {
      calendarId: yupObjectId.required(),
    },
    body: {
      userId: yupObjectId.required(),
      canWrite: Yup.boolean().required(),
    },
  },

  unshareCalendar: {
    params: { calendarId: yupObjectId },
    body: { userId: yupObjectId },
  },

  getCalendarDates: {
    params: { calendarId: yupObjectId },
    query: {
      month: Yup.number().integer().min(0).max(11).required(),
      year: Yup.number().integer().min(2000).max(2100).required(),
    },
  },

  deleteRecipeFromCalendarDate: {
    params: {
      calendarId: yupObjectId,
      day: Yup.number().min(1).max(31).required(),
      month: Yup.number().min(1).max(12).required(),
      year: Yup.number().min(2000).max(9999).required(),
      recipeId: yupObjectId.required(),
    },
  },

  postRecipeToCalendarDate: {
    params: {
      calendarId: yupObjectId,
      day: Yup.number().min(1).max(31).required(),
      month: Yup.number().min(1).max(12).required(),
      year: Yup.number().min(2000).max(9999).required(),
      recipeId: yupObjectId.required(),
    },
  },
};
