import { ApiError } from '@src/utils/ApiError';
import { appUploadFile, FileFilters } from '@src/middleware/appUploadFile';
import { Brand } from '@src/entities/Brand.entity';
import { BrandRepository } from '@src/repository/Brand.repository';
import { FoodRepository } from '@src/repository/Food.repository';
import {
  IGetFood,
  IPostFood,
  ISearchFood,
} from '@shared/types/routes/food.controller';
import { parseJSON } from '@src/middleware/parseJSON';
import { RouteSchemas } from '@shared/schemas/routes';
import { storageService } from '@src/services/Storage.service';
import { validate } from '@src/middleware/validate';
import express from 'express';
import { AppDataSource } from '@src/start/db';
import { CustomUnitDtoType, FoodDtoType } from '@shared/types/dto/Food.entity';
import { instanceToPlain } from 'class-transformer';
import { CustomUnitRepository } from '@src/repository/CustomUnit.repository';
import { NutritionMetricUnit } from '@src/entities/enums/NutritionMetricUnit.enum';
import { floatOrUndef } from '@src/utils/floatOrUndef';

const router = express.Router();

const upload = appUploadFile({ fileFilter: FileFilters.images });

router.get<
  ISearchFood['params'],
  ISearchFood['res'],
  ISearchFood['body'],
  ISearchFood['query']
>('/', async (req, res) => {
  const [foods, count] = await FoodRepository.search(
    req.query.str,
    req.query.page || 0,
  );

  res.send({
    count,
    foods: foods.map((food) => instanceToPlain(food) as FoodDtoType),
  });
});

router.get<
  IGetFood['params'],
  IGetFood['res'],
  IGetFood['body'],
  IGetFood['query']
>('/:id', validate(RouteSchemas.getFood), async (req, res) => {
  const food = await FoodRepository.findOne({
    where: { id: req.params.id },
    relations: { nutrients: true, brand: true },
  });

  if (!food) {
    throw new ApiError(404, `Item not found`);
  }

  const foodDto = instanceToPlain(food) as FoodDtoType;

  res.send(foodDto);
});

router.post<
  IPostFood['params'],
  IPostFood['res'],
  IPostFood['body'],
  IPostFood['query']
>(
  '/',
  upload.single('image'),
  validate(RouteSchemas.postFood),
  parseJSON,
  async (req, res) => {
    const { name: foodName, brand: brandName } = req.body;

    const foodBrandComboTaken = await FoodRepository.findOne({
      where: { name: foodName, brand: { name: brandName } },
    });

    if (foodBrandComboTaken) {
      throw new ApiError(409, `Food and brand combination already exists`);
    }

    let imageKey: string | null = null;
    if (req.file) {
      imageKey = await storageService.uploadFile(req, req.file.path);
    }

    let foodDto = {} as FoodDtoType;

    await AppDataSource.transaction(async (entityManager) => {
      let brand: Brand | null = null;
      if (brandName) {
        brand = await BrandRepository.findOneBy({ name: brandName });
        if (!brand) {
          brand = await entityManager.save(
            BrandRepository.create({
              name: brandName,
            }),
          );
        }
      }

      const customUnits = req.body.supportedUnits.filter<CustomUnitDtoType>(
        (unit): unit is CustomUnitDtoType => typeof unit !== 'string',
      );

      const customUnitEntities = customUnits.map((unit) =>
        CustomUnitRepository.create({
          metricQuantityPerUnit: unit.metricQuantityPerUnit,
          quantity: unit.quantity,
          unit: unit.unit,
        }),
      );

      let food = FoodRepository.create({
        name: foodName,
        brand,
        imageKey,
        nutrients: req.body.nutrients,
        customUnits: customUnitEntities,
        density: floatOrUndef(req.body.density),
        servingSizeMetricQuantity: floatOrUndef(
          req.body.servingSizeMetricQuantity,
        ),
        servingSizeMetricUnit:
          req.body.servingSizeMetricUnit === 'g'
            ? NutritionMetricUnit.GRAMS
            : NutritionMetricUnit.MILLILITER,
      });

      food = await entityManager.save(food);

      foodDto = instanceToPlain(food) as FoodDtoType;
    });

    res.status(201).send(foodDto);
  },
);

export default router;
