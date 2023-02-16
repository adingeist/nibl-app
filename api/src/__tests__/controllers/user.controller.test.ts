describe(`todo`, () => {
  it(`make testing library work`, () => {
    expect(true).toBe(true);
  });
});

// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { startApp } from '@src/__tests__/utils/startApp';
// const request = startApp();

// import _ from 'lodash';
// import { AuthTokenRepository } from '@src/repository/AuthToken.repository';
// import { DataHelper } from '@src/__tests__/utils/DataHelper';
// import { routePrefix } from '@src/start/routes';
// import { RouteSchemas } from '@shared/schemas/routes';
// import { User } from '@src/entities/User.entity';
// import { UserRepository } from '@src/repository/User.repository';
// import { v4 as uuidV4 } from 'uuid';
// import * as Validate from '@src/middleware/validate';
// import * as Auth from '@src/middleware/auth';
// import jwt from 'jsonwebtoken';
// import { UserRoles } from '@src/entities/enums/UserRoles.enum';

// jest.mock('@src/services/email.service');
// jest.mock('@src/services/sms.service');
// const validateSpy = jest.spyOn(Validate, 'testCall');
// const authSpy = jest.spyOn(Auth, 'testCall');

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe(`GET /users/:id`, () => {
//   let user: User;
//   let paramId: string;

//   beforeEach(async () => {
//     user = await UserRepository.save(DataHelper.createUser());
//     paramId = user.id;
//   });

//   afterEach(async () => {
//     await UserRepository.delete({});
//   });

//   const exec = () => request.get(`${routePrefix}/users/${paramId}`);

//   test(`valid input`, async () => {
//     const res = await exec();
//     expect(validateSpy).toBeCalledWith(RouteSchemas.getUser);

//     expect(JSON.stringify(res.error)).toBe('false');
//     expect(res.status).toBe(200);
//     expect(res.body).toMatchObject({
//       ..._.omit(user, ['password', 'email', 'phone']),
//       birthday: user.birthday?.toISOString(),
//       createdAt: user.createdAt?.toISOString(),
//       updatedAt: user.updatedAt?.toISOString(),
//     });
//   });

//   test(`id not found`, async () => {
//     paramId = uuidV4();
//     const res = await exec();
//     expect(res.status).toBe(404);
//   });
// });

// describe(`POST /users`, () => {
//   let reqBody: Record<string, string>;

//   beforeEach(() => {
//     reqBody = {
//       username: 'test_username',
//       email: 'test@niblet.app',
//       password: 't&e(*st(()t15z',
//     };
//   });

//   afterEach(async () => {
//     await AuthTokenRepository.delete({});
//     await UserRepository.delete({});
//   });

//   const exec = () => request.post(`${routePrefix}/users`).send(reqBody);

//   test.each`
//     email                | phone          | username           | password
//     ${'test@niblet.app'} | ${undefined}   | ${'test_username'} | ${'t&e(*st(()t15z'}
//     ${undefined}         | ${'123456789'} | ${'test_username'} | ${'t&e(*st(()t15z'}
//   `(
//     `given valid input - username, email='$email', phone='$phone' password`,
//     async ({ email, phone }) => {
//       reqBody.email = email;
//       reqBody.phone = phone;

//       const res = await exec();
//       expect(validateSpy).toBeCalledWith(RouteSchemas.postUser);

//       expect(JSON.stringify(res.error)).toBe('false');
//       expect(res.status).toBe(201);

//       const userInDb = await UserRepository.findOneBy({
//         username: reqBody.username,
//       });

//       expect(userInDb).not.toBeNull();
//       expect(userInDb?.password).not.toBe(reqBody.password);
//       expect(res.body).toMatchObject({ id: userInDb?.id });

//       const authToken = res.headers['x-auth-token'];
//       const decodedToken = jwt.decode(authToken);

//       expect(decodedToken).toMatchObject({
//         id: userInDb?.id,
//         username: userInDb?.username,
//         role: userInDb?.role,
//       });

//       const tokenInDb = await AuthTokenRepository.findOneBy({
//         user: { id: userInDb?.id },
//       });

//       expect(tokenInDb).not.toBeNull();
//       expect(tokenInDb?.pin.length).toBeGreaterThan(20); // expect hashed
//       expect(tokenInDb).toMatchObject({
//         attempts: 0,
//         sentToEmail: email !== undefined,
//         sentToPhone: phone !== undefined,
//       });
//     },
//   );

//   test(`given a username is taken`, async () => {
//     await UserRepository.save(
//       DataHelper.createUser({ username: reqBody.username }),
//     );

//     const res = await exec();

//     expect(res.status).toBe(409);
//   });

//   test(`given an email is taken`, async () => {
//     await UserRepository.save(DataHelper.createUser({ email: reqBody.email }));

//     const res = await exec();

//     expect(res.status).toBe(409);
//   });

//   test(`given a phone is taken`, async () => {
//     reqBody.phone = '123456879';

//     await UserRepository.save(DataHelper.createUser({ phone: reqBody.phone }));

//     const res = await exec();

//     expect(res.status).toBe(409);
//   });

//   test(`given an email and phone are null`, async () => {
//     // @ts-ignore
//     reqBody.email = null;
//     // @ts-ignore
//     reqBody.phone = null;

//     const res = await exec();

//     expect(res.status).toBe(400);
//   });
// });

// describe(`PUT /users`, () => {
//   let reqBody: Record<string, unknown>;
//   let user: User;

//   afterEach(async () => {
//     await AuthTokenRepository.delete({});
//     await UserRepository.delete({});
//   });

//   const exec = () => {
//     return request
//       .put(`${routePrefix}/users/${user.id}`)
//       .set(`x-auth-token`, user.getJWT())
//       .send(reqBody);
//   };

//   test(`valid input`, async () => {
//     user = await UserRepository.save(
//       DataHelper.createUser({
//         role: UserRoles.ADMIN,
//         birthday: new Date(0),
//         email: 'old.email@niblet.app',
//         phone: '123456789',
//         phoneIsVerified: true,
//         emailIsVerified: true,
//         username: 'old_username',
//         password: 'o1dw__pa55w!0rd*',
//       }),
//     );

//     reqBody = {
//       birthday: new Date(2000, 5, 5).toISOString(),
//       email: 'new.email@niblet.app',
//       phone: '132465798',
//       username: 'new_username',
//       password: 'n3_w__pa55w!0rd*',
//     };

//     const res = await exec();

//     expect(JSON.stringify(res.error)).toBe('false');
//     expect(authSpy).toBeCalledWith('user');
//     expect(validateSpy).toBeCalledWith(RouteSchemas.updateUser);

//     const updatedUserInDb = await UserRepository.findOneBy({
//       id: user.id,
//     });

//     expect(updatedUserInDb).toMatchObject({
//       birthday: new Date(2000, 5, 5),
//       email: 'new.email@niblet.app',
//       phone: '132465798',
//       username: 'new_username',
//       password: 'n3_w__pa55w!0rd*',

//       emailIsVerified: false,
//       phoneIsVerified: false,
//     });

//     // sent verification token to email
//     const emailAuthToken = await AuthTokenRepository.findOneBy({
//       user: { id: user.id },
//       sentToEmail: true,
//     });
//     expect(emailAuthToken?.pin.length).toBeGreaterThan(20); // expect hashed
//     expect(emailAuthToken).toMatchObject({
//       attempts: 0,
//       sentToEmail: true,
//       sentToPhone: false,
//     });

//     // sent verification token to phone
//     const phoneAuthToken = await AuthTokenRepository.findOneBy({
//       user: { id: user.id },
//       sentToPhone: true,
//     });
//     expect(phoneAuthToken?.pin.length).toBeGreaterThan(20); // expect hashed
//     expect(phoneAuthToken).toMatchObject({
//       attempts: 0,
//       sentToEmail: false,
//       sentToPhone: true,
//     });
//   });

//   test(`id not found`, async () => {
//     user = DataHelper.createUser();
//     user.id = uuidV4();

//     const res = await exec();

//     expect(res.status).toBe(404);
//   });
// });

// describe(`DELETE /users/:id`, () => {
//   let idToDelete: string;
//   let xAuthToken: string;

//   beforeEach(() => {
//     idToDelete = '';
//     xAuthToken = '';
//   });

//   afterEach(async () => {
//     await AuthTokenRepository.delete({});
//     await UserRepository.delete({});
//   });

//   const exec = () =>
//     request
//       .delete(`${routePrefix}/users/${idToDelete}`)
//       .set(`x-auth-token`, xAuthToken);

//   test(`valid input - user deleting self`, async () => {
//     const user = await UserRepository.save(
//       DataHelper.createUser({ role: UserRoles.USER }),
//     );
//     const authToken = await AuthTokenRepository.create(
//       DataHelper.createAuthToken({ user }),
//     );
//     idToDelete = user.id;
//     xAuthToken = user.getJWT();

//     const res = await exec();

//     expect(JSON.stringify(res.error)).toBe('false');
//     expect(res.body).toMatchObject({ id: user.id });
//     expect(res.status).toBe(200);

//     expect(validateSpy).toBeCalledWith(RouteSchemas.deleteUser);
//     expect(authSpy).toBeCalledWith('user');

//     const authTokenInDb = await AuthTokenRepository.findOneBy({
//       id: authToken.id,
//     });

//     const userInDb = await UserRepository.findOneBy({ id: user.id });

//     expect(authTokenInDb).toBeFalsy();
//     expect(userInDb).toBeFalsy();
//   });

//   test(`valid input - admin deleting other`, async () => {
//     const user = await UserRepository.save(
//       DataHelper.createUser({ role: UserRoles.ADMIN }),
//     );

//     xAuthToken = user.getJWT();

//     const otherUser = await UserRepository.save(DataHelper.createUser());

//     idToDelete = otherUser.id;

//     const res = await exec();

//     expect(JSON.stringify(res.error)).toBe('false');
//     expect(res.body).toMatchObject({ id: otherUser.id });
//     expect(res.status).toBe(200);

//     expect(validateSpy).toBeCalledWith(RouteSchemas.deleteUser);
//     expect(authSpy).toBeCalledWith('user');

//     const otherInDb = await UserRepository.findOneBy({
//       id: otherUser.id,
//     });

//     expect(otherInDb).toBeFalsy();
//   });

//   test(`user deleting other`, async () => {
//     const otherUser = await UserRepository.save(
//       DataHelper.createUser({ role: UserRoles.USER }),
//     );
//     idToDelete = otherUser.id;
//     xAuthToken = DataHelper.createUser({
//       role: UserRoles.USER,
//     }).getJWT();

//     const res = await exec();

//     expect(res.status).toBe(403);

//     expect(validateSpy).toBeCalledWith(RouteSchemas.deleteUser);
//     expect(authSpy).toBeCalledWith('user');

//     const otherUserInDb = await UserRepository.findOneBy({
//       id: otherUser.id,
//     });

//     expect(otherUserInDb).toBeTruthy();
//   });

//   test(`id not found`, async () => {
//     const user = await UserRepository.save(
//       DataHelper.createUser({ role: UserRoles.ADMIN }),
//     );

//     idToDelete = uuidV4();
//     xAuthToken = user.getJWT();
//     const res = await exec();

//     expect(res.status).toBe(404);

//     const userInDb = await UserRepository.findOneBy({ id: user.id });

//     expect(userInDb).toBeTruthy();
//   });
// });
