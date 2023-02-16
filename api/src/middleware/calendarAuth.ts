import { ApiError } from '@src/utils/ApiError';
import { CalendarUserRepository } from '@src/repository/CalendarUser.repository';
import { CalendarUserRoles } from '@src/entities/enums/CalendarUserRole.enum';
import { In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';

export const calendarAuth =
  (...permittedRoles: CalendarUserRoles[]) =>
  async (
    req: Request & { params: { calendarId: string } },
    res: Response,
    next: NextFunction,
  ) => {
    const user = await CalendarUserRepository.findOneBy({
      id: req.user?.id,
      calendar: { id: req.params.calendarId },
      role: In(permittedRoles),
    });

    if (!user) {
      throw new ApiError(403, `You lack permission to perform that action`);
    }

    next();
  };
