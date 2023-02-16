import _ from 'lodash';
import { ApiError } from '@src/utils/ApiError';
import { AppDataSource } from '@src/start/db';
import {
  IDeleteUser,
  IGetUser,
  IGetUserEmail,
  IGetUserNibs,
  IGetUserPhone,
  IGetUserProfile,
  IGetUserRecipes,
  IPostUser,
  IUpdateUser,
} from '@shared/types/routes/users.controller';
import { appConfig } from '@src/utils/config';
import { getAppRouter } from '@src/utils/appRouter';
import { auth } from '@src/middleware/auth';
import { AuthTokenRepository } from '@src/repository/AuthToken.repository';
import { CalendarRepository } from '@src/repository/Calendar.repository';
import { CalendarUserRepository } from '@src/repository/CalendarUser.repository';
import { CalendarUserRoles } from '@src/entities/enums/CalendarUserRole.enum';
import { FollowerRepository } from '@src/repository/Follower.repository';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';
import { hash } from '@src/utils/bcrypt';
import { instanceToPlain } from 'class-transformer';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { NibRepository } from '@src/repository/Nib.repository';
import { parseJSON } from '@src/middleware/parseJSON';
import { PostLikeRepository } from '@src/repository/PostLike.repository';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { Request } from 'express';
import { RouteSchemas } from '@shared/schemas/routes';
import { storageService } from '@src/services/Storage.service';
import { User } from '@src/entities/User.entity';
import { UserNotificationSettings } from '@src/entities/UserNotificationSettings.entity';
import { UserRepository } from '@src/repository/User.repository';
import { validate } from '@src/middleware/validate';
import multer from 'multer';

const router = getAppRouter();

const omitUser = (user: User) => _.omit(user, ['password', 'email', 'phone']);

const checkDuplicateValues = async (req: Request) => {
  if (await UserRepository.findByUsername(req.body.username)) {
    throw new ApiError(409, `That username is already in use`);
  }

  if (await UserRepository.findByEmail(req.body.email)) {
    throw new ApiError(409, `That email is already in use`);
  }

  if (await UserRepository.findByPhone(req.body.phone)) {
    throw new ApiError(409, `That phone is already in use`);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: 'temp/uploads',
  }),
  fileFilter: (req, file, cb) => {
    if (appConfig.get('okImageTypes').includes(file.mimetype)) cb(null, true);
    else cb(null, false);
  },
  limits: {
    fieldNameSize: 100, // bytes
    fields: 100, // max non-file fields allowed
    fieldSize: 1 * 1024 * 1024, // 1 MB
    files: 2, // file fields
    fileSize: 5 * 1024 * 1024, // 5 MB
    parts: 50, // fields + files
  },
});

// GET /users/:id
router.get<IGetUser>(
  '/:id',
  validate(RouteSchemas.getUser),
  async (req, res) => {
    const user = await UserRepository.findOneBy({
      id: req.params.id,
    });

    if (!user) throw new ApiError(404, `User with given ID doesn't exist`);

    res.send(omitUser(user) as unknown as IGetUser['res']);
  },
);

// GET /users/:username/profile
router.get<IGetUserProfile>(
  '/:username/profile',
  validate(RouteSchemas.getUserProfile),
  async (req, res) => {
    const user = await UserRepository.findOneBy({
      username: req.params.username,
    });

    if (!user) throw new ApiError(404, `User not found`);

    const likesCount = await PostLikeRepository.countBy({
      postLiked: { postedBy: { id: user.id } },
    });

    const followersCount = await FollowerRepository.countBy({
      followingUser: { id: user.id },
    });

    const nibCount = await NibRepository.countBy({
      post: { postedBy: { id: user.id } },
    });

    const recipeCount = await RecipeRepository.countBy({
      post: { postedBy: { id: user.id } },
    });

    const profileDto = instanceToPlain(user);

    res.send({
      createdAt: profileDto.createdAt,
      id: profileDto.id,
      isVerified: profileDto.isVerified,
      followersCount,
      likesCount,
      nibCount,
      recipeCount,
      updatedAt: profileDto.updatedAt,
      username: profileDto.username,
      bio: profileDto.bio,
      link: profileDto.link,
      profileImage: profileDto.profileImage,
    });
  },
);

// GET /users/:username/recipes
router.get<IGetUserRecipes>(
  '/:username/recipes',
  validate(RouteSchemas.getUserRecipes),
  async (req, res) => {
    const page = req.query.page || 0;
    const take = 10;
    const skip = page * take;

    const [feedRecipeDtos, totalCount] =
      await RecipeRepository.getUsernamesRecipesDtoAndCount(
        req.params.username,
        skip,
        take,
      );

    res.send({
      ...getPaginationMetaData(page, take, totalCount),
      recipes: feedRecipeDtos,
    });
  },
);

// GET /users/:username/nibs
router.get<IGetUserNibs>(
  '/:username/nibs',
  validate(RouteSchemas.getUserNibs),
  async (req, res) => {
    const page = req.query.page || 0;
    const take = 10;
    const skip = page * take;

    const [nibs, totalCount] = await NibRepository.getUsernamesNibDtosAndCount(
      req.params.username,
      skip,
      take,
    );

    res.send({
      ...getPaginationMetaData(page, take, totalCount),
      nibs,
    });
  },
);

// GET /users/self/email
router.get<IGetUserEmail>(`/self/email`, auth('user'), async (req, res) => {
  const user = await UserRepository.findOne({
    where: { id: req.user?.id },
    select: { email: true, emailIsVerified: true },
  });

  if (!user) {
    throw new ApiError(404, `User not found`);
  }

  res.send({
    email: user.email,
    emailIsVerified: user.emailIsVerified,
  });
});

// GET /users/self/phone
router.get<IGetUserPhone>(`/self/phone`, auth('user'), async (req, res) => {
  const user = await UserRepository.findOne({
    where: { id: req.user?.id },
    select: { phone: true, phoneIsVerified: true },
  });

  if (!user) {
    throw new ApiError(404, `User not found`);
  }

  res.send({
    phone: user.phone,
    phoneIsVerified: user.phoneIsVerified,
  });
});

// POST /users
router.post<IPostUser>(
  '/',
  validate(RouteSchemas.postUser),
  async (req, res) => {
    if (!req.body.email && !req.body.phone) {
      throw new ApiError(400, `An email or phone must be provided.`);
    }

    await checkDuplicateValues(req);

    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = await hash(req.body.password);

    const pushSettings = new UserNotificationSettings();
    pushSettings.user = user;
    pushSettings.notifyCommentOnPost = true;
    pushSettings.notifyCommentReply = true;
    pushSettings.notifyPostLikes = true;
    pushSettings.notifyRecipeGetsNib = true;

    await AppDataSource.transaction(async (entityManager) => {
      user = await entityManager.save(user);

      await entityManager.save(pushSettings);

      if (req.body.email) {
        const token = await user.emailAuthToken();
        await entityManager.save(token);
      }

      if (req.body.phone) {
        const token = await user.smsAuthToken();
        await entityManager.save(token);
      }

      const calendar = CalendarRepository.create({
        isPrimary: true,
        name: `${user.username}'s calendar`,
      });

      const calendarUser = CalendarUserRepository.create({
        user,
        calendar,
        role: CalendarUserRoles.OWNER,
      });

      await entityManager.save(calendar);
      await entityManager.save(calendarUser);
    });

    res.status(201).header('x-auth-token', user.getJWT()).send({
      id: user.id,
      createdAt: user.createdAt.toISOString(),
      emailIsVerified: user.emailIsVerified,
      isVerified: user.isVerified,
      phoneIsVerified: user.phoneIsVerified,
      role: user.role,
      updatedAt: user.updatedAt.toISOString(),
      username: user.username,
      bio: user.bio,
      birthday: user.birthday?.toISOString(),
      link: user.link,
      profileImageKey: user.profileImageKey,
    });
  },
);

// PUT /users/:id
router.put<IUpdateUser>(
  '/:id',
  auth('user'),
  upload.single('profilePicture'),
  parseJSON,
  validate(RouteSchemas.updateUser),
  async (req, res) => {
    const { email, password, phone } = req.body;

    await checkDuplicateValues(req);

    const user = await UserRepository.findOneBy({
      id: req.params.id,
    });

    if (!user) throw new ApiError(404, 'User not found');

    if (email) {
      user.email = email;
      const emailedAuthToken = await user.emailAuthToken();
      await AuthTokenRepository.save(emailedAuthToken);
      user.emailIsVerified = false;
    }

    if (phone) {
      user.phone = phone;
      const smsAuthToken = await user.smsAuthToken();
      await AuthTokenRepository.save(smsAuthToken);
      user.phoneIsVerified = false;
    }

    if (password) {
      req.body.password = await hash(password);
    }

    let storedFileName: string;
    if (req.file) {
      storedFileName = await storageService.uploadFile(req, req.file.path);
      user.profileImageKey = storedFileName;
    }

    UserRepository.merge(user, req.body);
    await UserRepository.save(user);

    res.send(omitUser(user) as unknown as IUpdateUser['res']);
  },
);

// DELETE /users/:id
router.delete<IDeleteUser>(
  '/:id',
  auth('user'),
  validate(RouteSchemas.deleteUser),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    if (
      userRequesting.id !== req.params.id &&
      userRequesting.role !== 'admin'
    ) {
      throw new ApiError(403, 'You must be admin to delete other users');
    }

    const deleteRes = await UserRepository.delete({
      id: req.params.id,
    });

    if (!deleteRes.affected) {
      throw new ApiError(404, 'User not found');
    }

    res.send();
  },
);

export default router;
