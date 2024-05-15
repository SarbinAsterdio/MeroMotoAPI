import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryInterface } from 'src/category/category.interface';
import { CategoryService } from 'src/category/category.service';
import { ModelService } from 'src/models/model.service';
import { CheckData, applyPagination, VehicleCondition } from 'src/utils/common';
import { isUuidV4, CreateVariantDto, UpdateVariantDto } from 'src/utils/dtos';
import {
  Variant,
  Vehicle,
  EngineAndTransmission,
  DimensionAndCapacity,
  ComfortAndConvenience,
  EntertainmentAndCommunication,
  Exterior,
  Interior,
  FuelAndPerformance,
  MotorAndBattery,
  SafetyAndFeatures,
  SuspensionSteeringAndBrake,
  AvailableColor,
} from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import {
  VariantWithSpecs,
  ALlVariants,
  VariantInterface,
  ModelPopulated,
  ModelInterface,
} from 'src/utils/interfaces';

import { EntityManager, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class VariantService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(EngineAndTransmission)
    private readonly engineAndTransmissionRepo: Repository<EngineAndTransmission>,
    @InjectRepository(DimensionAndCapacity)
    private readonly dimensionAndCapacityRepo: Repository<DimensionAndCapacity>,
    @InjectRepository(ComfortAndConvenience)
    private readonly comfortAndConvenienceRepo: Repository<ComfortAndConvenience>,
    @InjectRepository(EntertainmentAndCommunication)
    private readonly entertainmentAndCommunicationRepo: Repository<EntertainmentAndCommunication>,
    @InjectRepository(Exterior)
    private readonly exteriorRepo: Repository<Exterior>,
    @InjectRepository(Interior)
    private readonly interiorRepo: Repository<Interior>,
    @InjectRepository(FuelAndPerformance)
    private readonly fuelAndPerformanceRepo: Repository<FuelAndPerformance>,
    @InjectRepository(MotorAndBattery)
    private readonly motorAndBatteryRepo: Repository<MotorAndBattery>,
    @InjectRepository(SafetyAndFeatures)
    private readonly safteyAndFeaturesRepo: Repository<SafetyAndFeatures>,
    @InjectRepository(SuspensionSteeringAndBrake)
    private readonly SuspensionSteeringAndBrakeRepo: Repository<SuspensionSteeringAndBrake>,
    @InjectRepository(AvailableColor)
    private readonly availableColorRepo: Repository<AvailableColor>,
    private readonly categoryService: CategoryService,
    private readonly modelService: ModelService,
    private readonly checkData: CheckData,
  ) {}

  //get all available variants
  async getAllVariants(
    page: number,
    limit: number,
    model: string,
    category: string,
    search: string,
    minPrice: number,
    maxPrice: number,
    all: boolean,
  ): Promise<ALlVariants> {
    const query = await this.createQueryForVariant();
    if (!all && search) {
      query.where(
        'LOWER(variant.variant) ILIKE :search OR LOWER(model.model) ILIKE :search OR LOWER(category.name) ILIKE :search OR CAST(variant.price AS text) ILIKE :search',
        { search: `%${search.toLocaleLowerCase()}%` },
      );

      // to parse the search value as an integer
      const searchPrice = parseInt(search.trim());

      // Check  the parsed value is a number
      if (!isNaN(searchPrice)) {
        query.orWhere('variant.price = :searchPrice', { searchPrice });
      }
    }
    if (!all && !search && category) {
      const categoryKey = isUuidV4(category) ? 'id' : 'slug';
      query.andWhere(`category.${categoryKey} = :categoryValue`, {
        categoryValue: category,
      });
    }

    if (!all && !search && maxPrice && minPrice) {
      query.andWhere('variant.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    }

    if (!all && !search && model) {
      const modelKey = isUuidV4(model) ? 'id' : 'slug';
      query.andWhere(`model.${modelKey} = :modelValue`, {
        modelValue: model,
      });
    }

    //get total count
    const total = await query.getCount();

    //apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );

    const variants = await PaginatedQuery.orderBy(
      'variant.createdAt',
      'DESC',
    ).getMany();
    return { variants, pagination };
  }

  private async createQueryForVariant() {
    const variantQuery = this.variantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.category', 'category')
      .leftJoinAndSelect('variant.model', 'model')
      .leftJoinAndSelect(
        'variant.engineAndTransmission',
        'engineAndTransmission',
      )
      .leftJoinAndSelect('variant.dimensionAndCapacity', 'dimensionAndCapacity')
      .leftJoinAndSelect(
        'variant.comfortAndConvenience',
        'comfortAndConvenience',
      )
      .leftJoinAndSelect(
        'variant.entertainmentAndCommunication',
        'entertainmentAndCommunication',
      )
      .leftJoinAndSelect('variant.exterior', 'exterior')
      .leftJoinAndSelect('variant.interior', 'interior')
      .leftJoinAndSelect('variant.fuelAndPerformance', 'fuelAndPerformance')
      .leftJoinAndSelect('variant.motorAndBattery', 'motorAndBattery')
      .leftJoinAndSelect('variant.safetyAndFeatures', 'safetyAndFeatures')
      .leftJoinAndSelect(
        'variant.suspensionSteeringAndBrake',
        'suspensionSteeringAndBrake',
      );
    return variantQuery;
  }

  //to get a variant by variant id
  async getOneVariant(id: string): Promise<VariantWithSpecs> {
    const query = await this.createQueryForVariant();
    const variant = await query.where('variant.id=:id', { id }).getOne();

    if (!variant)
      throw new NotFoundException('Variant not found with given id');
    // console.log(typeof variant.engineAndTransmission.maximumTorque);
    variant.totalView++;
    await this.variantRepository.save(variant);
    return variant;
  }

  //to add a new variant
  async createVariant(
    createVariantDto: CreateVariantDto,
  ): Promise<{ message: string; variant: VariantInterface }> {
    const { variant: name, category, model, baseVariant } = createVariantDto;
    //check if name already exists in db
    await this.checkData.checkDuplicateName(
      this.variantRepository,
      'variant',
      name,
    );

    //check if given category model  already exists in db
    const [checkCategory, checkModel] = await Promise.all([
      this.categoryService.getCategoryById(category),
      this.modelService.getModelById(model),
    ]);
    //category of 0 index as electric is not included in checkModel
    if (category !== checkModel.category[0].id) {
      throw new NotAcceptableException(
        `Category must be same as model's category`,
      );
    }
    let msg = 'Variant added successfully';
    if (baseVariant) {
      const check = await this.variantRepository
        .createQueryBuilder('variant')
        .innerJoin('variant.model', 'model', 'model.id =:model', { model })
        .where('variant.baseVariant = :baseVariant', { baseVariant })
        .getOne();
      if (check) {
        msg = 'Base variant already exists.So this cannot be base variant';
        createVariantDto.baseVariant = false;
      }
    }
    const createVariant = await this.transactionalVariantOperation(
      createVariantDto,
      checkCategory,
      checkModel,
    );
    const createdVariant = await this.getOneVariant(createVariant.id);
    //TO UPDATE VEHICLE IF IT IS CREATED
    await this.updateVehicles(checkModel, createdVariant);

    return { message: msg, variant: createdVariant };
  }

  //TO UPDATE A VARIANT
  async updateVariant(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<{ message: string; variant: VariantInterface }> {
    const { variant, category, model, baseVariant, image } = updateVariantDto;

    await this.checkData.checkDuplicateName(
      this.variantRepository,
      'variant',
      variant,
      id,
    );
    const [existingVariant, checkCategory, checkModel] = await Promise.all([
      this.getOneVariant(id),
      this.categoryService.getCategoryById(category),
      this.modelService.getModelById(model),
    ]);

    if (category !== checkModel.category[0].id) {
      throw new NotAcceptableException(
        `Category must be same as model's category`,
      );
    }

    let msg = 'Variant updated successfully';
    if (baseVariant !== existingVariant.baseVariant) {
      if (existingVariant.baseVariant && !baseVariant) {
        throw new NotAcceptableException(
          'Cannot update existing base variant.',
        );
      }
      const check = await this.variantRepository
        .createQueryBuilder('variant')
        .innerJoin('variant.model', 'model', 'model.id =:model', { model })
        .where('variant.baseVariant = :baseVariant', { baseVariant })
        .getOne();
      if (check) {
        msg = 'Base variant already exists.So this cannot be base variant';
        updateVariantDto.baseVariant = false;
      } else {
        //if image is updated after creating variant
        const vehicles = await this.vehicleRepository
          .createQueryBuilder('vehicle')
          .innerJoin('vehicle.model', 'model', 'model.id= :model', { model })
          .getMany();
        for (const vehicle of vehicles) {
          if (!vehicle.images) {
            vehicle.images = [];
          }
          vehicle.images.unshift(image ? image : existingVariant.image);

          await this.vehicleRepository.save(vehicle);
        }
      }
    }

    updateVariantDto.slug = await updateSlug(variant);
    await this.transactionalVariantOperation(
      updateVariantDto,
      checkCategory,
      checkModel,
      id,
    );
    const updatedVariant = await this.getOneVariant(id);
    //UpdateVehicles if exists
    await this.updateVehicles(checkModel, updatedVariant);

    return { message: msg, variant: updatedVariant };
  }

  private async updateVehicles(
    model: ModelPopulated,
    variant: VariantWithSpecs,
  ) {
    const allVehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .where('vehicle.model = :modelId', { modelId: model.id })
      .getMany();
    if (allVehicles.length > 0) {
      //update vehicle
      const updateVehicles = allVehicles.map(async (vehicle) => {
        const {
          engineDisplacement,
          mileage,
          maximumPower,
          maximumTorque,
          driveType,
          transmission: trans,
        } = variant.engineAndTransmission;
        const { fuelType: ft } = variant.fuelAndPerformance;
        const { frontBrakeType, rearBrakeType } =
          variant.suspensionSteeringAndBrake;
        const { price, image } = variant;
        const updatedVehicleDto = {
          variants: [...vehicle.variants, variant],
          id: vehicle.id,
          fuelType: !vehicle.fuelType.includes(ft)
            ? [...vehicle.fuelType, ft]
            : vehicle.fuelType,
          transmission: !vehicle.transmission.includes(trans)
            ? [...vehicle.transmission, trans]
            : vehicle.transmission,
          trim: !vehicle.trim.includes(driveType)
            ? [...vehicle.trim, driveType]
            : vehicle.trim,
          minBHP: Math.min(vehicle.minBHP, maximumPower),
          maxBHP: Math.max(vehicle.maxBHP, maximumPower),
          torque: Math.max(vehicle.torque, maximumTorque),

          brakes: (() => {
            if (
              !vehicle.brakes.includes(frontBrakeType) &&
              !vehicle.brakes.includes(rearBrakeType)
            ) {
              return [...vehicle.brakes, frontBrakeType, rearBrakeType];
            } else if (!vehicle.brakes.includes(frontBrakeType)) {
              return [...vehicle.brakes, frontBrakeType];
            } else if (!vehicle.brakes.includes(rearBrakeType)) {
              return [...vehicle.brakes, rearBrakeType];
            } else {
              return [...vehicle.brakes];
            }
          })(),
          maxMileage: Math.max(vehicle.maxMileage, mileage),
          minMileage: Math.min(vehicle.minMileage, mileage),

          minEngineDisplacement: Math.min(
            vehicle.minEngineDisplacement,
            engineDisplacement,
          ),
          maxEngineDisplacement: Math.max(
            vehicle.maxEngineDisplacement,
            engineDisplacement,
          ),

          variantImages: [...vehicle.variantImages, image],
          minPrice:
            vehicle.condition === VehicleCondition.NEW
              ? !vehicle.minPrice
                ? null
                : Math.min(vehicle.minPrice, price)
              : vehicle.minPrice,
          maxPrice:
            vehicle.condition === VehicleCondition.NEW
              ? Math.max(vehicle.maxPrice, price)
              : vehicle.maxPrice,
        };

        this.vehicleRepository.save(updatedVehicleDto);
      });

      await Promise.all(updateVehicles);
    }
  }

  private async transactionalVariantOperation(
    variantDto: CreateVariantDto | UpdateVariantDto,
    checkCategory: CategoryInterface,
    checkModel: ModelInterface,
    id?: string,
  ): Promise<VariantWithSpecs> {
    return this.entityManager
      .transaction(async (transactionalEntityManager) => {
        try {
          const {
            engineAndTransmission,
            dimensionAndCapacity,
            comfortAndConvenience,
            entertainmentAndCommunication,
            exterior,
            fuelAndPerformance,
            interior,
            motorAndBattery,
            safetyAndFeatures,
            suspensionSteeringAndBrake,
          } = variantDto;
          let engineAndTransmissionEntity =
            this.engineAndTransmissionRepo.create(engineAndTransmission);
          let dimensionAndCapacityEntity =
            this.dimensionAndCapacityRepo.create(dimensionAndCapacity);
          let comfortAndConvenienceEntity =
            this.comfortAndConvenienceRepo.create(comfortAndConvenience);
          let entertainmentAndCommunicationEntity =
            this.entertainmentAndCommunicationRepo.create(
              entertainmentAndCommunication,
            );
          let exteriorEntity = this.exteriorRepo.create(exterior);
          let fuelAndPerformanceEntity =
            this.fuelAndPerformanceRepo.create(fuelAndPerformance);
          let interiorEntity = this.interiorRepo.create(interior);
          let motorAndBatteryEntity =
            this.motorAndBatteryRepo.create(motorAndBattery);
          let safetyEntity =
            this.safteyAndFeaturesRepo.create(safetyAndFeatures);
          let suspensionSteeringAndBrakeEntity =
            this.SuspensionSteeringAndBrakeRepo.create(
              suspensionSteeringAndBrake,
            );

          [
            engineAndTransmissionEntity,
            comfortAndConvenienceEntity,
            dimensionAndCapacityEntity,
            entertainmentAndCommunicationEntity,
            exteriorEntity,
            fuelAndPerformanceEntity,
            interiorEntity,
            motorAndBatteryEntity,
            safetyEntity,
            suspensionSteeringAndBrakeEntity,
          ] = await Promise.all([
            transactionalEntityManager.save(
              EngineAndTransmission,
              engineAndTransmissionEntity,
            ),
            transactionalEntityManager.save(
              ComfortAndConvenience,
              comfortAndConvenienceEntity,
            ),
            transactionalEntityManager.save(
              DimensionAndCapacity,
              dimensionAndCapacityEntity,
            ),
            transactionalEntityManager.save(
              EntertainmentAndCommunication,
              entertainmentAndCommunicationEntity,
            ),
            transactionalEntityManager.save(Exterior, exteriorEntity),
            transactionalEntityManager.save(
              FuelAndPerformance,
              fuelAndPerformanceEntity,
            ),
            transactionalEntityManager.save(Interior, interiorEntity),
            transactionalEntityManager.save(
              MotorAndBattery,
              motorAndBatteryEntity,
            ),
            transactionalEntityManager.save(SafetyAndFeatures, safetyEntity),
            transactionalEntityManager.save(
              SuspensionSteeringAndBrake,
              suspensionSteeringAndBrakeEntity,
            ),
          ]);

          const variantObj = this.variantRepository.create({
            ...variantDto,
            category: checkCategory,
            model: checkModel,
            engineAndTransmission: engineAndTransmissionEntity,
            comfortAndConvenience: comfortAndConvenienceEntity,
            dimensionAndCapacity: dimensionAndCapacityEntity,
            entertainmentAndCommunication: entertainmentAndCommunicationEntity,
            exterior: exteriorEntity,
            fuelAndPerformance: fuelAndPerformanceEntity,
            interior: interiorEntity,
            motorAndBattery: motorAndBatteryEntity,
            safetyAndFeatures: safetyEntity,
            suspensionSteeringAndBrake: suspensionSteeringAndBrakeEntity,
          });

          if (id) {
            // If updating, set the ID
            variantObj.id = id;
          }

          const variant = await transactionalEntityManager.save(
            Variant,
            variantObj,
          );
          return variant;
        } catch (error) {
          // Rollback the transaction if an error occurs
          await transactionalEntityManager.query('ROLLBACK');
          throw error;
        }
      })
      .catch((error) => {
        // Handle transaction-related errors here
        if (error instanceof QueryFailedError) {
          console.error('Database error:', error.message); // Print the database error message
          throw new HttpException(
            'Database error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          console.error('Internal server error:', error.message); // Print the internal server error message
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }

  //check if all vairants exists
  async checkVariants(
    variantIdsOrSlug: Array<string>,
    modelId?: string,
  ): Promise<Array<VariantWithSpecs>> {
    const queryKey = variantIdsOrSlug.every(isUuidV4) ? 'id' : 'slug';
    const query = await this.createQueryForVariant();
    const variantFind = await query
      .where(`variant.${queryKey} IN (:...allVariants)`, {
        allVariants: variantIdsOrSlug,
      })
      .getMany();
    const variantCheck = variantIdsOrSlug.filter(
      (id) => !variantFind.some((data) => data.id === id),
    );

    if (variantCheck.length > 0) {
      throw new BadRequestException(
        `Given ${variantIdsOrSlug[0]} variant does not exist!`,
      );
    }
    if (modelId) {
      const mismatchedVariants = variantFind.filter(
        (data) => data.model.id !== modelId,
      );

      if (mismatchedVariants.length > 0) {
        throw new BadRequestException(
          `Variants ${mismatchedVariants.map((variant) => variant.id).join(', ')} do not belong to the specified model.`,
        );
      }
    }
    return variantFind;
  }

  //check if all vairants exists
  async checkVariantsWithBrandANdModel(
    variantIdsOrSlug: Array<string>,
  ): Promise<Array<VariantWithSpecs>> {
    const queryKey = variantIdsOrSlug.every(isUuidV4) ? 'id' : 'slug';
    const variantKey = queryKey === 'id' ? 'id' : 'slug';
    const query = await this.createQueryForVariant();

    const allVariants = await query
      // .leftJoinAndSelect('variant.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .where(`variant.${queryKey} IN (:...allVariants)`, {
        allVariants: variantIdsOrSlug,
      })
      .select([
        'variant',
        'model.model',
        'model.id',
        'model.slug',
        'model.isElectric',
        'brand.brand',
        'brand.id',
        'brand.slug',
        'category.id',
        'category.slug',
        'category.type',
        'engineAndTransmission',
        'dimensionAndCapacity',
        'comfortAndConvenience',
        'entertainmentAndCommunication',
        'exterior',
        'interior',
        'fuelAndPerformance',
        'motorAndBattery',
        'safetyAndFeatures',
        'suspensionSteeringAndBrake',
      ])
      .getMany();

    //getting all variants ids even if it has id or slug from dto...
    const variantIds = allVariants.map((variant) => variant[variantKey]);
    //to check if all variants exists or not
    if (allVariants.length !== variantIdsOrSlug.length) {
      const missingVariantIds = variantIdsOrSlug.filter(
        // (variantId: string) => !allVariants.map((v) => v.id).includes(variantId)
        (variantId: string) => !variantIds.includes(variantId),
      );

      if (missingVariantIds.length > 0) {
        throw new BadRequestException(
          `Variants not found: ${missingVariantIds.join(', ')}`,
        );
      }
    }
    return allVariants;
  }

  //DELETE VARIANT
  async deleteVariant(id: string): Promise<void> {
    const variant = await this.variantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.vehicles', 'vehicles')
      .where('variant.id = :id', { id })
      .getOne();
    if (!variant) throw new NotFoundException('Variant not found');
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .where('variants.id = :id', { id })
      .getMany();
    // Remove the association between availableColors and the vehicle
    // for (const vehicle of variant.vehicles) {
    //   await this.availableColorRepo
    //     .createQueryBuilder()
    //     .update()
    //     .set({ vehicle: null })
    //     .where('vehicle = :vehicle', { vehicle: vehicle.id })
    //     .execute();

    //   // Clear the availableColors array in the vehicle entity
    //   vehicle.availableColors = [];
    // }
    // Remove the vehicle
    for (const vehicle of vehicles) {
      if (vehicle.variants.length <= 1) {
        await this.availableColorRepo
          .createQueryBuilder()
          .update()
          .set({ vehicle: null })
          .where('vehicle = :vehicle', { vehicle: vehicle.id })
          .execute();

        // Clear the availableColors array in the vehicle entity
        vehicle.availableColors = [];
        await this.vehicleRepository.remove([vehicle]);
      }
    }

    await this.variantRepository.remove(variant);
  }

  async getVariantsByModelId(
    modelId: string,
  ): Promise<Array<VariantWithSpecs>> {
    await this.modelService.getModelById(modelId);
    const variants = (await this.createQueryForVariant())
      .where('variant.model = :modelId', { modelId })
      .getMany();
    return variants;
  }

  //get base variant using model id
  async getBaseVariant(
    modelId: string,
    key: string,
  ): Promise<VariantInterface> {
    const baseVariant = await this.variantRepository
      .createQueryBuilder('variant')
      .where('variant.model = :modelId', { modelId })
      .andWhere('variant.baseVariant = :baseVariant', { baseVariant: true })
      .getOne();

    if (!baseVariant)
      throw new BadRequestException(
        'Please select a base variant of given model',
      );
    return baseVariant;
  }
}
