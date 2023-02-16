export interface PlanDto {
  id: string;
  name: string;
  pricePerMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetPlans {
  params: never;
  res: PlanDto[];
  body: never;
  query: never;
}

export interface IPostPlan {
  params: never;
  res: PlanDto;
  body: { name: string; pricePerMonth: number };
  query: never;
}

export interface IPutPlan {
  params: { planId: string };
  res: PlanDto;
  body: { name?: string; pricePerMonth?: number };
  query: never;
}
