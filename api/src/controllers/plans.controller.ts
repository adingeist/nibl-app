import { Plan } from '@src/entities/Subscription/Plan.entity';
import { auth } from '@src/middleware/auth';
import { PlanRepository } from '@src/repository/Plan.repository';
import {
  IGetPlans,
  IPostPlan,
  IPutPlan,
  PlanDto,
} from '@src/shared/types/routes/plans.controller';
import { ApiError } from '@src/utils/ApiError';
import { appRouter } from '@src/utils/appRouter';
import { instanceToPlain } from 'class-transformer';

// GET /subscriptions/plans
appRouter.get<IGetPlans>(
  '/subscriptions/plans',
  auth('user'),
  async (req, res) => {
    const plans = await PlanRepository.find();

    const plansDto = instanceToPlain(plans) as PlanDto[];

    res.send(plansDto);
  },
);

// POST /subscriptions/plans
appRouter.post<IPostPlan>(
  '/subscriptions/plans',
  auth('admin'),
  async (req, res) => {
    const name = req.body.name;
    const pricePerMonth = req.body.pricePerMonth;

    const duplicateName = await PlanRepository.findOneBy({ name });

    if (duplicateName) {
      throw new ApiError(409, 'Plan with that name already created');
    }

    let plan = PlanRepository.create({ name, pricePerMonth });

    plan = await PlanRepository.save(plan);

    const planDto = instanceToPlain(plan) as PlanDto;

    res.send(planDto);
  },
);

// PUT /subscriptions/plans/:planId
appRouter.put<IPutPlan>(
  '/subscriptions/plans/:planId',
  auth('admin'),
  async (req, res) => {
    const planId = req.params.planId;

    const oldPlan = await PlanRepository.findOneBy({ id: planId });

    if (!oldPlan) {
      throw new ApiError(404, 'Plan not found');
    }

    const newPlan: Plan = {
      ...oldPlan,
      ...req.body,
    };

    const isNameChange = oldPlan.name !== newPlan.name;

    if (isNameChange) {
      const duplicateName = await PlanRepository.findOneBy({
        name: newPlan.name,
      });

      if (duplicateName) {
        throw new ApiError(409, 'Plan with that name already created');
      }
    }

    await PlanRepository.save(newPlan);

    const newPlanDto = instanceToPlain(newPlan) as PlanDto;

    res.send(newPlanDto);
  },
);

export default appRouter;
