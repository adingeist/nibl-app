// import { auth } from '@src/middleware/auth';
// import { PlanRepository } from '@src/repository/Plan.repository';
// import { SubscriptionRepository } from '@src/repository/Subscription.repository';
// import { UserRepository } from '@src/repository/User.repository';
// import {
//   IGetUsersSubscription,
//   IPostUsersSubscription,
//   SubscriptionDto,
// } from '@src/shared/types/routes/subscriptions.controller';
// import { ApiError } from '@src/utils/ApiError';
// import { appRouter } from '@src/utils/appRouter';
// import { instanceToPlain } from 'class-transformer';

// // GET /subscriptions/:userId
// appRouter.get<IGetUsersSubscription>(
//   '/subscriptions/:userId',
//   auth('admin'),
//   async (req, res) => {
//     const userId = req.params.userId;

//     const subscriptions = await SubscriptionRepository.find({
//       where: { user: { id: userId } },
//       relations: { plan: true, user: { id: true } },
//     });

//     const subscriptionsDto = instanceToPlain(
//       subscriptions,
//     ) as SubscriptionDto[];

//     res.send(subscriptionsDto);
//   },
// );

// // POST /subscriptions/:userId
// appRouter.post<IPostUsersSubscription>(
//   'subscriptions',
//   auth('user'),
//   async (req, res) => {
//     const planId = req.body.planId;

//     const plan = await PlanRepository.findOne({ where: { id: planId } });

//     if (!plan) {
//       throw new ApiError(404, 'Plan not found');
//     }

//     const user = await UserRepository.findUserRequestingOrThrow404(req);

//     const subscription = SubscriptionRepository.create({
//       start: new Date(),
//       cancelledAt: null,
//       end: new Date(),
//       plan,
//       user,
//     });

//     res.send(subscriptionDto);
//   },
// );

// export default appRouter;
