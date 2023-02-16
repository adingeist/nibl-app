import { PlanDto } from '@shared/types/routes/plans.controller';

export interface SubscriptionDto {
  id: string;
  user: { id: string };
  plan: PlanDto;
  start: string;
  end: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IGetUsersSubscription {
  params: { userId: string };
  res: SubscriptionDto[];
  body: never;
  query: never;
}

export interface IPostUsersSubscription {
  params: { userId: string };
  res: SubscriptionDto;
  body: { planId: string };
  query: never;
}
