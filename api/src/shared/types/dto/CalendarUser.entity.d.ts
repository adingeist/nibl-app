export type CalendarUserRolesType = 'owner' | 'editor' | 'reader';

export type CalendarUserDto = {
  id: string;
  user: { id: string; username: string; profileImage?: string };
  calendarId: string;
  role: CalendarUserRolesType;
  createdAt: string;
  updatedAt: string;
};
