import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BodyTypeInterface,
  BodyTypeWithCategory,
} from 'src/bodyTypes/bodyType.interface';
import { BrandWithCategory } from 'src/brands/brand.interface';
import { BrandService } from 'src/brands/brand.service';
import { CategoryService } from 'src/category/category.service';
import { ModelService } from 'src/models/model.service';
import {
  applyPagination,
  VehicleCondition,
  vehicleName,
  SeatingCapacity,
} from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import {
  Vehicle,
  Brand,
  Variant,
  BodyType,
  AvailableColor,
} from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import { ModelInterface } from 'src/utils/interfaces';
import { VariantWithSpecs } from 'src/variants/variant.interface';
import { VariantService } from 'src/variants/variant.service';

import { Repository } from 'typeorm';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle.dto';
import {
  VehicleInterface,
  AllVehicles,
  VehiclePopulated,
  priceRange,
  HomePageVehicle,
  HomePageElectric,
  PopularUsedVehicles,
  VehicleImageInterface,
} from './vehicle.interface';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(BodyType)
    private readonly bodyTypeRepository: Repository<BodyType>,
    @InjectRepository(AvailableColor)
    private readonly availableColorRepo: Repository<AvailableColor>,
    private readonly variantService: VariantService,
    private readonly brandService: BrandService,
    @Inject(forwardRef(() => ModelService))
    private readonly modelService: ModelService,
    private readonly categoryService: CategoryService,
  ) {}

  //get all available vehicles
  async getAllVehicles(
    page: number,
    limit: number,
    search: string,
    category: string,
    brand: string,
    model: string,
    bodyType: string,
    condition: string,
    type: string,
    approved: boolean,
    certified: boolean,
    upcoming: boolean,
    minPrice: number,
    maxPrice: number,
    all: boolean,
  ): Promise<AllVehicles> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.category', 'category')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .leftJoinAndSelect('vehicle.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color')
      .orderBy('vehicle.createdAt', 'DESC');

    if (!all && search) {
      query.where(
        'LOWER(vehicle.name) ILIKE :search OR LOWER(brand.brand) ILIKE :search OR LOWER(model.model) ILIKE :search OR LOWER(category.name) ILIKE :search OR LOWER(variants.variant) ILIKE :search OR LOWER(bodyType.bodyType) ILIKE :search',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
    }
    //apply search filter
    if (!all && !search && condition) {
      query.andWhere('LOWER(CAST(vehicle.condition AS text)) =:condition', {
        condition: `${condition.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && type) {
      query.andWhere('LOWER(CAST(vehicle.type AS text)) =:type', {
        type: `${type.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && category) {
      const categoryKey = isUuidV4(category) ? 'id' : 'slug';
      query.andWhere(`category.${categoryKey} = :categoryValue`, {
        categoryValue: category,
      });
    }
    if (!all && !search && brand) {
      const brandKey = isUuidV4(brand) ? 'id' : 'slug';
      query.andWhere(`brand.${brandKey} = :brandValue`, {
        brandValue: brand,
      });
    }
    if (!all && !search && model) {
      const modelKey = isUuidV4(model) ? 'id' : 'slug';
      query.andWhere(`model.${modelKey} = :modelValue`, {
        modelValue: model,
      });
    }
    if (!all && !search && bodyType) {
      const bodyTypeKey = isUuidV4(bodyType) ? 'id' : 'slug';
      query.andWhere(`bodyType.${bodyTypeKey} = :bodyTypeValue`, {
        bodyTypeValue: bodyType,
      });
    }
    // if (!all && !search && maxPrice && minPrice) {
    //   query.andWhere('vehicle.minPrice BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    // }
    if (!all && !search && minPrice && maxPrice) {
      query.andWhere(
        'vehicle.minPrice <= :maxPrice AND vehicle.maxPrice >= :minPrice',
        {
          minPrice,
          maxPrice,
        },
      );
    }

    if (!all && !search && approved) {
      query.andWhere('vehicle.approved = :approved', { approved });
    }

    if (!all && !search && certified) {
      query
        .andWhere('vehicle.certified = :certified', { certified })
        .andWhere('vehicle.condition = :condition', { condition: 'used' });
    }
    if (!all && !search && upcoming) {
      query.andWhere('vehicle.upcomming = :upcomming', { upcomming: upcoming });
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

    const vehicles = await PaginatedQuery.getMany();
    return { vehicles, pagination };
  }

  //get one vehicle using vehicle id
  async getOneVehicle(id: string): Promise<VehiclePopulated> {
    const vehicle = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.category', 'category')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .leftJoinAndSelect('vehicle.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color');

    if (isUuidV4(id)) {
      vehicle.where('vehicle.id=:id', { id });
    } else {
      vehicle.where('vehicle.slug=:slug', { slug: id });
    }
    const result = await vehicle.getOne();

    if (!result) {
      throw new NotFoundException('Vehicle not found');
    }
    return result;
  }

  //add a new vehicle
  async addNewVehicle(
    createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleInterface> {
    const {
      name,
      category,
      brand,
      model,
      condition,
      price,
      variant,
      availableColor,
      year,
    } = createVehicleDto;

    // Fetch and check category, brand, and model data concurrently
    const [checkCategory, checkBrand, checkModel] = await Promise.all([
      this.categoryService.getCategoryById(category),
      this.brandService.getBrandById(brand),
      this.modelService.getModelById(model),
    ]);

    if (!checkBrand.categories.some((cat) => cat.id === category)) {
      throw new NotAcceptableException(
        `Given brand ${brand} doesn't have ${category} category`,
      );
    }
    //category [0] because can only be 1 category in array while fetching
    if (category !== checkModel.category[0].id) {
      throw new NotAcceptableException(
        `Category must be same as model's category`,
      );
    }
    const usedVehicleColor = checkModel.availableColors.find(
      (ac) => ac.id === availableColor,
    );
    if (condition == VehicleCondition.USED && !usedVehicleColor) {
      throw new NotAcceptableException('Available color not found in model');
    }
    //get all variants in case of new but get variant by id in case of used
    let allVariants: Array<VariantWithSpecs>;
    if (condition === VehicleCondition.NEW) {
      allVariants = await this.variantService.getVariantsByModelId(
        checkModel.id,
      );
    } else if (variant) {
      allVariants = await this.variantService.checkVariants(
        [variant],
        checkModel.id,
      );
      // [await this.variantService.getOneVariant(variant)];
    } else {
      throw new NotAcceptableException('Please select a variant');
    }

    const newVehicle = {
      ...createVehicleDto,
      transmission: [],
      trim: [],
      brakes: [],
      name:
        condition === VehicleCondition.NEW
          ? await vehicleName(checkBrand.brand, checkModel.model)
          : condition === VehicleCondition.USED && name
            ? name
            : null,
      ...(condition == VehicleCondition.NEW && {
        certified: true,
        usedVehicleTotalMileage: null,
        location: null,
        registerYear: null,
        features: null,
        blueBookImages: null,
        roadTaxImages: null,
        insuranceImages: null,
      }),
      variantImages: [],
      minPrice: condition === VehicleCondition.USED && price ? price : null,
      maxPrice: condition === VehicleCondition.USED && price ? price : null,
      minMileage: null,
      maxMileage: null,
      minEngineDisplacement: null,
      maxEngineDisplacement: null,
      fuelType: [],
      minBHP: null,
      maxBHP: null,
      bootSpace: 0,
      seats: SeatingCapacity.ONE,
      year:
        condition === VehicleCondition.USED && year ? year : checkModel.year,
      fuelTank: 0,
      torque: 0,
      tyreType: '',
      batteryCapacity: 0,
      batteryRange: 0,
      chargingTime0to80: 0,
      topspeed: 0,
      bodyType: checkModel.bodyType,
      variants: allVariants,
      type: checkCategory.type,
      isElectric: checkModel.isElectric,
      availableColors:
        condition === VehicleCondition.USED
          ? [usedVehicleColor]
          : checkModel.availableColors,
      slug: null,
    };
    newVehicle.slug = await updateSlug(newVehicle.name);
    if (condition === VehicleCondition.NEW) {
      const checkExistingNewVehicle = await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .where('vehicle.slug =:slug', { slug: newVehicle.slug })
        .getOne();
      if (checkExistingNewVehicle)
        throw new NotAcceptableException(
          'New vehicle of this model already exists.',
        );
    }

    allVariants.forEach((variant) => {
      const {
        engineDisplacement,
        mileage,
        maximumPower,
        maximumTorque,
        driveType,
        transmission: trans,
        batteryCapacity: batteryC,
        range: btRange,
        chargingTime0to80: chargingTime,
      } = variant.engineAndTransmission;
      const { fuelType: ft, topSpeed } = variant.fuelAndPerformance;
      const { frontBrakeType, rearBrakeType, radialTyre, tubelessTyre } =
        variant.suspensionSteeringAndBrake;
      const {
        fuelCapacity,
        seatingCapacity,
        bootSpace: bootSPac,
      } = variant.dimensionAndCapacity;

      const { price, image } = variant;
      if (condition === VehicleCondition.NEW) {
        if (price) {
          //in first iteration min is set to null and maxi is set to the price from variant
          if (newVehicle.maxPrice == null && newVehicle.minPrice == null) {
            newVehicle.maxPrice = price;
            newVehicle.minPrice = null;
          } else if (price > newVehicle.maxPrice) {
            //from second iteration if price of variant is greater than maxPrice set minPrice
            //  to max Price and maxPrice to price of variant
            newVehicle.minPrice = newVehicle.maxPrice;
            newVehicle.maxPrice = price;
          } else {
            newVehicle.minPrice = price;
          }

          // newVehicle.minPrice = Math.min(newVehicle.minPrice || price, price);
          // newVehicle.maxPrice = Math.max(newVehicle.maxPrice || price, price);
        }
        if (image) newVehicle.variantImages.push(image);
      }

      if (engineDisplacement !== null) {
        newVehicle.minEngineDisplacement = Math.min(
          newVehicle.minEngineDisplacement || engineDisplacement,
          engineDisplacement,
        );
        newVehicle.maxEngineDisplacement = Math.max(
          newVehicle.maxEngineDisplacement || engineDisplacement,
          engineDisplacement,
        );
      }

      if (maximumPower !== null) {
        newVehicle.maxBHP = Math.max(
          newVehicle.maxBHP || maximumPower,
          maximumPower,
        );
        newVehicle.minBHP = Math.min(
          newVehicle.minBHP || maximumPower,
          maximumPower,
        );
      }
      if (maximumTorque !== null) {
        newVehicle.torque = Math.max(
          newVehicle.torque || maximumTorque,
          maximumTorque,
        );
      }
      if (driveType !== null && !newVehicle.trim.includes(driveType))
        newVehicle.trim.push(driveType);
      if (trans !== null && !newVehicle.transmission.includes(trans))
        newVehicle.transmission.push(trans);
      if (ft !== null && !newVehicle.fuelType.includes(ft))
        newVehicle.fuelType.push(ft);
      if (topSpeed !== null) newVehicle.topspeed = topSpeed;
      if (
        frontBrakeType !== null &&
        !newVehicle.brakes.includes(frontBrakeType)
      )
        newVehicle.brakes.push(frontBrakeType);
      if (rearBrakeType !== null && !newVehicle.brakes.includes(rearBrakeType))
        newVehicle.brakes.push(rearBrakeType);
      if (radialTyre) newVehicle.tyreType = 'Radial Tyre';
      if (tubelessTyre) newVehicle.tyreType = 'Tubeless Tyre';
      if (fuelCapacity !== null) newVehicle.fuelTank = fuelCapacity;
      if (seatingCapacity !== null) newVehicle.seats = seatingCapacity;
      if (bootSPac !== null) newVehicle.bootSpace = bootSPac;
      if (batteryC != null) newVehicle.batteryCapacity = batteryC;
      if (btRange != null) newVehicle.batteryRange = btRange;
      if (chargingTime !== null) newVehicle.chargingTime0to80 = chargingTime;

      if (mileage !== null) {
        newVehicle.minMileage = Math.min(
          newVehicle.minMileage || mileage,
          mileage,
        );
        newVehicle.maxMileage = Math.max(
          newVehicle.maxMileage || mileage,
          mileage,
        );
      }
    });
    const newV = this.vehicleRepository.create(newVehicle);
    const createVehicle = await this.vehicleRepository.save(newV);

    // if (checkModel.availableColors && checkModel.availableColors.length > 0) {
    //   if (condition === VehicleCondition.USED) {
    //     const usedVehicleColor = checkModel.availableColors.find((ac) => ac.id === availableColor);

    //     if (usedVehicleColor) {
    //       const newAvColor = this.availableColorRepo.create({
    //         ...usedVehicleColor,
    //         vehicle: [...usedVehicleColor.vehicle,createVehicle],
    //       });
    //       await this.availableColorRepo.save(newAvColor);
    //     }
    //   } else if (condition === VehicleCondition.NEW) {
    //     const allColors = checkModel.availableColors.map(async (ac) => {
    //       const newAvColor = this.availableColorRepo.create({
    //         ...ac,
    //         id: ac.id,
    //         vehicle: [createVehicle],
    //       });
    //       return this.availableColorRepo.save(newAvColor);
    //     });

    //     await Promise.all(allColors);
    //   }
    // }
    return await this.getOneVehicle(createVehicle.id);
  }

  //to check if the variants is different from db while updating the vehicle so not to do redundant calculations
  checkForVariants(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  //update vehicle by vehicle id
  async updateVehicleById(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehiclePopulated> {
    const {
      name,
      category,
      brand,
      model,
      variant,
      condition,
      price,
      usedVehicleTotalMileage,
      exteriorImages,
      interiorImages,
      availableColor,
      upcoming,
    } = updateVehicleDto;
    const checkModel = await this.modelService.getModelById(model);
    const existingVehicle = await this.getOneVehicle(id);
    if (
      condition === VehicleCondition.NEW &&
      existingVehicle.condition === VehicleCondition.USED
    ) {
      throw new NotAcceptableException(
        'Used Vehicle cannot be converted to new Vehicle',
      );
    }
    if (condition == VehicleCondition.USED) {
      if (!checkModel.availableColors.some((av) => av.id === availableColor)) {
        throw new NotAcceptableException('Available color not found in model');
      }
    }
    //get all variants in case of new but get variant by id in case of used
    let allVariants: Array<VariantWithSpecs>;
    //get all variants in case of new but get variant by id in case of used
    if (condition === VehicleCondition.NEW) {
      allVariants = await this.variantService.getVariantsByModelId(
        checkModel.id,
      );
    } else if (variant) {
      allVariants = await this.variantService.checkVariants(
        [variant],
        checkModel.id,
      );
      // [await this.variantService.getOneVariant(variant)];
    } else {
      throw new NotAcceptableException('Please select a variant');
    }
    if (existingVehicle.category.id !== category) {
      throw new NotAcceptableException('Cannot update category');
    }
    if (existingVehicle.brand.id !== brand) {
      throw new NotAcceptableException('Cannot update brand');
    }
    if (existingVehicle.model.id !== model) {
      throw new NotAcceptableException('Cannot update model');
    }
    if (upcoming === true && existingVehicle.upcoming === false) {
      throw new NotAcceptableException('Cannot update upcoming');
    }
    const usedVehicleColor = checkModel.availableColors.find(
      (ac) => ac.id === availableColor,
    );
    if (condition == VehicleCondition.USED && !usedVehicleColor) {
      throw new NotAcceptableException('Available color not found in model');
    }
    const updatedDto = {
      ...updateVehicleDto,
      bodyType: existingVehicle.bodyType,
      variants: allVariants,
      type: existingVehicle.type,
      isElectric: existingVehicle.isElectric,

      category: existingVehicle.category,
      brand: existingVehicle.brand,
      model: existingVehicle.model,
      id,
      fuelType: [],
      transmission: [],
      trim: [],
      minBHP: existingVehicle.minBHP,
      maxBHP: existingVehicle.maxBHP,
      bootSpace: existingVehicle.bootSpace,
      seats: existingVehicle.seats,
      year:
        condition === VehicleCondition.NEW
          ? existingVehicle.year
          : updateVehicleDto.year,
      fuelTank: existingVehicle.fuelTank,
      torque: existingVehicle.torque,

      brakes: [],
      tyreType: existingVehicle.tyreType,
      batteryCapacity: existingVehicle.batteryCapacity,
      batteryRange: existingVehicle.batteryRange,
      chargingTime0To80: existingVehicle.chargingTime0to80,
      maxMileage: existingVehicle.maxMileage,
      minMileage: existingVehicle.minMileage,

      minEngineDisplacement: existingVehicle.minEngineDisplacement,
      maxEngineDisplacement: existingVehicle.maxEngineDisplacement,

      topSpeed: existingVehicle.topSpeed,
      name:
        condition === VehicleCondition.USED && name
          ? name
          : existingVehicle.name,
      variantImages: [],
      exteriorImages:
        condition === VehicleCondition.USED && exteriorImages
          ? exteriorImages
          : existingVehicle.exteriorImages,
      interiorImages:
        condition === VehicleCondition.USED && interiorImages
          ? interiorImages
          : existingVehicle.interiorImages,
      minPrice:
        condition === VehicleCondition.USED && price
          ? price
          : existingVehicle.minPrice,
      maxPrice:
        condition === VehicleCondition.USED && price
          ? price
          : existingVehicle.maxPrice,
      usedVehicleTotalMileage:
        condition === VehicleCondition.USED ? usedVehicleTotalMileage : null,
      slug: existingVehicle.slug,
      availableColors:
        condition === VehicleCondition.USED
          ? [usedVehicleColor]
          : checkModel.availableColors,
    };
    if (condition === VehicleCondition.USED && name !== existingVehicle.name) {
      updatedDto.slug = await updateSlug(updatedDto.name);
    }
    // const variantIds: Array<string> = existingVehicle.variants.map((v) => v.id);
    //uncomment after updating all vehicles it is for updating transmission
    // if (!this.checkForVariants(variants, variantIds)) {

    allVariants.forEach((variant) => {
      const {
        engineDisplacement,
        mileage,
        maximumPower,
        maximumTorque,
        driveType,
        transmission: trans,
        batteryCapacity: batteryC,
        range: btRange,
        chargingTime0to80,
      } = variant.engineAndTransmission;
      const { fuelType: ft, topSpeed } = variant.fuelAndPerformance;
      const { frontBrakeType, rearBrakeType, radialTyre, tubelessTyre } =
        variant.suspensionSteeringAndBrake;
      const {
        fuelCapacity,
        seatingCapacity,
        bootSpace: bootSPac,
      } = variant.dimensionAndCapacity;

      const { price, image } = variant;

      if (condition === VehicleCondition.NEW) {
        if (price) {
          updatedDto.minPrice = Math.min(updatedDto.minPrice || price, price);
          updatedDto.maxPrice = Math.max(updatedDto.maxPrice || price, price);
        }
        if (image) updatedDto.variantImages.push(image);
      }

      if (maximumPower !== null || undefined) {
        updatedDto.maxBHP = Math.max(maximumPower, updatedDto.maxBHP);
        updatedDto.minBHP = Math.min(maximumPower, updatedDto.minBHP);
      }
      if (maximumTorque !== null || undefined)
        updatedDto.torque = maximumTorque;
      if (engineDisplacement !== null || undefined) {
        updatedDto.maxEngineDisplacement = Math.max(
          engineDisplacement,
          updatedDto.maxEngineDisplacement,
        );
        updatedDto.minEngineDisplacement = Math.min(
          engineDisplacement,
          updatedDto.minEngineDisplacement,
        );
      }
      if (topSpeed !== null || undefined) updatedDto.topSpeed = topSpeed;

      if (
        (driveType !== null || undefined) &&
        !updatedDto.trim.includes(String(driveType))
      )
        updatedDto.trim.push(String(driveType));
      if (
        (trans !== null || undefined) &&
        !updatedDto.transmission.includes(trans)
      )
        updatedDto.transmission.push(trans);
      if ((ft !== null || undefined) && !updatedDto.fuelType.includes(ft))
        updatedDto.fuelType.push(ft);
      if (
        (frontBrakeType !== null || undefined) &&
        !updatedDto.brakes.includes(frontBrakeType)
      )
        updatedDto.brakes.push(frontBrakeType);
      if (
        (rearBrakeType !== null || undefined) &&
        !updatedDto.brakes.includes(rearBrakeType)
      )
        updatedDto.brakes.push(rearBrakeType);
      if (radialTyre) updatedDto.tyreType = 'Radial Tyre';
      if (tubelessTyre) updatedDto.tyreType = 'Tubeless Tyre';
      if (fuelCapacity !== null || undefined)
        updatedDto.fuelTank = fuelCapacity;
      if (seatingCapacity !== null || undefined)
        updatedDto.seats = seatingCapacity;
      if (bootSPac !== null || undefined) updatedDto.bootSpace = bootSPac;
      if (batteryC != null || undefined) updatedDto.batteryCapacity = batteryC;

      if (btRange != null || undefined) updatedDto.batteryRange = btRange;
      if (chargingTime0to80 !== null || undefined)
        updatedDto.chargingTime0To80 = chargingTime0to80;
      if (mileage !== null || undefined) {
        updatedDto.minMileage = Math.min(mileage, updatedDto.minMileage);
        updatedDto.maxMileage = Math.max(mileage, updatedDto.maxMileage);
      }
    });

    // //Update available color for used vehicle
    // if (condition === VehicleCondition.USED && existingVehicle?.availableColors[0]?.id !== availableColor) {
    //   const existingAvailableColorId = existingVehicle.availableColors[0]?.id;
    //   //if used vehicle already has available color remove its association with vehicle
    //   if (existingAvailableColorId) {
    //     await this.availableColorRepo
    //       .createQueryBuilder()
    //       .update('avcolor')
    //       .set({ vehicleId: null })
    //       .where('avcolor.id =:id', { id: existingVehicle.availableColors[0].id })
    //       .execute();
    //   }
    //   //add   available color  to vehicle
    //   await this.availableColorRepo
    //     .createQueryBuilder()
    //     .update('available_color')
    //     .set({ vehicle: id })
    //     .where('available_color.id = :id', { id: availableColor })
    //     .execute();
    // }
    const updateVehicle = await this.vehicleRepository.save(updatedDto);

    // if (checkModel.availableColors && checkModel.availableColors.length > 0) {
    //   if (condition == VehicleCondition.USED && existingVehicle.availableColors[0].id !== availableColor) {
    //     // if (condition == VehicleCondition.USED) {
    //     const usedVehicleColor = checkModel.availableColors.find((ac) => ac.id === availableColor);

    //     if (usedVehicleColor) {
    //       const newAvColor = this.availableColorRepo.create({
    //         ...usedVehicleColor,
    //         vehicle: updateVehicle,
    //       });
    //       await this.availableColorRepo.save(newAvColor);
    //     }
    //   }
    // } else {
    //   const allColors = checkModel.availableColors.map(async (ac) => {
    //     const newAvColor = this.availableColorRepo.create({
    //       ...ac,
    //       id: ac.id,
    //       vehicle: updateVehicle,
    //     });
    //     return this.availableColorRepo.save(newAvColor);
    //   });

    //   await Promise.all(allColors);
    // }

    return await this.getOneVehicle(updateVehicle.id);
  }

  //deleteVehicle By vehice id
  async deleteVehicle(id: string) {
    const vehicle = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.availableColors', 'availableColors')
      .where('vehicle.id = :id', { id })
      .getOne();
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // Clear the availableColors array in the vehicle entity
    vehicle.availableColors = [];

    // Remove the vehicle
    await this.vehicleRepository.remove(vehicle);
    return true;
  }

  //price range according to category
  async getPriceRangeByCategory(
    category: string,
    key: string,
  ): Promise<Array<priceRange>> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select(['vehicle.minPrice', 'vehicle.maxPrice']);
    // .andWhere('vehicle.condition = :condition', { condition: 'new' });

    if (isUuidV4(category)) {
      query.innerJoin(
        'vehicle.category',
        'category',
        'category.id = :categoryId',
        { categoryId: category },
      );
    } else {
      query.innerJoin('vehicle.category', 'category', 'category.slug = :slug', {
        slug: category,
      });
    }
    const allprices = await query.getMany();
    const maximum = Math.max(...allprices.map((price) => price.maxPrice));
    const minimum = Math.min(...allprices.map((price) => price.minPrice));
    const arr = [];
    if (minimum < 800000) {
      if (minimum < 450000) {
        arr.push({ minPrice: 0, maxPrice: 500000, label: `Below 5 Lakhs` });
        arr.push({ minPrice: 500000, maxPrice: 800000, label: `5-8 Lakhs` });
        arr.push({ minPrice: 800000, maxPrice: 1000000, label: `8-10 Lakhs` });
      } else {
        arr.push({ minPrice: 0, maxPrice: 1000000, label: `Below 10 Lakhs` });
      }
    } else if (minimum < 1700000) {
      arr.push({ minPrice: 0, maxPrice: 2000000, label: `Below 20 Lakhs` });
    } else if (minimum < 2700000) {
      arr.push({ minPrice: 0, maxPrice: 3000000, label: 'Below 30 Lakhs' });
    } else if (minimum < 4500000) {
      arr.push({ minPrice: 0, maxPrice: 5000000, label: 'Below 50 Lakhs' });
    } else if (minimum < 85000000) {
      arr.push({ minPrice: 0, maxPrice: 10000000, label: 'Below 1 Crore' });
    }

    if (minimum < 800000) {
      if (maximum < 30000000 && maximum > 10000000) {
        arr.push({
          minPrice: 1000000,
          maxPrice: 3000000,
          label: '10-30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 'above',
          label: 'Above 1 Crore',
        });
      }

      if (maximum < 50000000 && maximum > 30000000) {
        arr.push({
          minPrice: 1000000,
          maxPrice: 3000000,
          label: '10-30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({
          minPrice: 30000000,
          maxPrice: 'above',
          label: 'Above 3 Crore',
        });
      }
      if (maximum > 50000000) {
        arr.push({
          minPrice: 1000000,
          maxPrice: 3000000,
          label: '10-30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({ minPrice: 30000000, maxPrice: 50000000, label: '3-5Crore' });
        arr.push({
          minPrice: 50000000,
          maxPrice: 'above',
          label: 'Above 5 Crore',
        });
      }
    } else if (minimum < 1700000) {
      if (maximum < 30000000 && maximum > 10000000) {
        arr.push({
          minPrice: 2000000,
          maxPrice: 3000000,
          label: '20-30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 'above',
          label: 'Above 1 Crore',
        });
      }

      if (maximum < 50000000 && maximum > 30000000) {
        arr.push({
          minPrice: 2000000,
          maxPrice: 3000000,
          label: '20-30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({
          minPrice: 30000000,
          maxPrice: 'above',
          label: 'Above 3 Crore',
        });
      }
      if (maximum > 50000000) {
        arr.push({
          minPrice: 1000000,
          maxPrice: 3000000,
          label: '20 -30 Lakhs',
        });
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30 - 50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50 -99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1 -3 Crore',
        });
        arr.push({
          minPrice: 30000000,
          maxPrice: 50000000,
          label: '3 -5Crore',
        });
        arr.push({
          minPrice: 50000000,
          maxPrice: 'above',
          label: 'Above 5 Crore',
        });
      }
    } else if (minimum < 2700000) {
      if (maximum < 30000000 && maximum > 10000000) {
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 'above',
          label: 'Above 1 Crore',
        });
      }

      if (maximum < 50000000 && maximum > 30000000) {
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 'above',
          label: 'Above 3 Crore',
        });
      }
      if (maximum > 50000000) {
        arr.push({
          minPrice: 3000000,
          maxPrice: 5000000,
          label: '30-50 Lakhs',
        });
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: ' 50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({ minPrice: 30000000, maxPrice: 50000000, label: '3-5Crore' });
        arr.push({
          minPrice: 50000000,
          maxPrice: 'above',
          label: 'Above 5 Crore',
        });
      }
    } else if (minimum < 4500000) {
      if (maximum < 30000000 && maximum > 10000000) {
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 'above',
          label: 'Above 1 Crore',
        });
      }

      if (maximum < 70000000 && maximum > 40000000) {
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: '50-99 Lakhs',
        });
        arr.push({ minPrice: 1, maxPrice: 3, label: '1-3 Crore' });
        arr.push({ minPrice: 3, maxPrice: 'above', label: 'Above 3 Crore' });
      }
      if (maximum > 70000000) {
        arr.push({
          minPrice: 5000000,
          maxPrice: 9900000,
          label: ' 50-99 Lakhs',
        });
        arr.push({
          minPrice: 10000000,
          maxPrice: 30000000,
          label: '1-3 Crore',
        });
        arr.push({
          minPrice: 30000000,
          maxPrice: 50000000,
          label: '3-5 Crore',
        });
        arr.push({
          minPrice: 50000000,
          maxPrice: 'above',
          label: 'Above 5 Crore',
        });
      }
    } else if (minimum < 8500000) {
      if (maximum < 20000000 && maximum > 120000000) {
        arr.push({
          minPrice: 10000000,
          maxPrice: 50000000,
          label: '1-5 Crore',
        });
        arr.push({
          minPrice: 50000000,
          maxPrice: 80000000,
          label: '5-8 Crore',
        });
        arr.push({
          minPrice: 80000000,
          maxPrice: 120000000,
          label: '8-12 Crore',
        });
        arr.push({
          minPrice: 120000000,
          maxPrice: 'above',
          label: 'Above 12 Crore',
        });
      }

      if (maximum < 500000000 && maximum > 20000000) {
        arr.push({
          minPrice: 10000000,
          maxPrice: 50000000,
          label: '1-5 Crore',
        });
        arr.push({
          minPrice: 50000000,
          maxPrice: 80000000,
          label: '5-8 Crore',
        });
        arr.push({
          minPrice: 80000000,
          maxPrice: 120000000,
          label: '8-12 Crore',
        });
        arr.push({
          minPrice: 120000000,
          maxPrice: 200000000,
          label: '12-20 Crore',
        });
        arr.push({
          minPrice: 200000000,
          maxPrice: 'above',
          label: 'Above 20 Crore',
        });
      }
      if (maximum > 50000000) {
        arr.push({
          minPrice: 10000000,
          maxPrice: 50000000,
          label: '1-5 Crore',
        });
        arr.push({
          minPrice: 50000000,
          maxPrice: 80000000,
          label: '5-8 Crore',
        });
        arr.push({
          minPrice: 80000000,
          maxPrice: 120000000,
          label: '8-12 Crore',
        });
        arr.push({
          minPrice: 120000000,
          maxPrice: 200000000,
          label: '12-20 Crore',
        });
        arr.push({
          minPrice: 200000000,
          maxPrice: 500000000,
          label: '20-50 Crore',
        });
        arr.push({
          minPrice: 500000000,
          maxPrice: 'above',
          label: 'Above 50 Crore',
        });
      }
    }
    return arr;

    //another method
    const ranges = [
      {
        limit: 800000,
        ranges: [
          { min: 0, max: 500000, label: `Below 5 Lakhs` },
          { min: 500000, max: 800000, label: `5-8 Lakhs` },
          { min: 800000, max: 1000000, label: `8-10 Lakhs` },
        ],
      },
      {
        limit: 1700000,
        ranges: [{ min: 0, max: 2000000, label: `Below 20 Lakhs` }],
      },
      {
        limit: 2700000,
        ranges: [{ min: 0, max: 3000000, label: `Below 30 Lakhs` }],
      },
      {
        limit: 4500000,
        ranges: [{ min: 0, max: 5000000, label: `Below 50 Lakhs` }],
      },
      {
        limit: 8500000,
        ranges: [{ min: 0, max: 10000000, label: `Below 1 Crore` }],
      },
    ];

    const appendRanges = (min, max, rangesToAppend) => {
      rangesToAppend.forEach((range) => {
        arr.push({
          minPrice: range.min + min,
          maxPrice: range.max,
          label: range.label.replace('avove', 'above'),
        });
      });
    };

    ranges.forEach((range) => {
      if (minimum < range.limit) {
        if (maximum >= range.limit && maximum > 10000000) {
          appendRanges(range.limit, range.limit * 2, range.ranges);
          arr.push({
            minPrice: range.limit * 2,
            maxPrice: 'above',
            label: `Above ${(range.limit * 2) / 100000} Crore`,
          });
        } else if (maximum >= range.limit && maximum <= 10000000) {
          appendRanges(range.limit, range.limit * 2, range.ranges);
          arr.push({
            minPrice: range.limit * 2,
            maxPrice: maximum,
            label: `${(range.limit * 2) / 100000} - ${maximum / 100000} Crore`,
          });
        } else {
          appendRanges(range.limit, range.limit * 2, range.ranges);
        }
      }
    });
  }

  //home page (trending approved used certified)
  async forHomePage(
    trending: boolean,
    approved: boolean,
    used: boolean,
    category: string,
    certified: boolean,
    userId: string,
    key: string,
  ): Promise<Array<HomePageVehicle>> {
    const query = await this.buildCommonVehicleQuery({ category, userId });

    if (category && approved && !trending && !used && !certified)
      query.andWhere('vehicle.approved = :approved', { approved: true });

    if (category && used && !approved && !trending && !certified)
      query.andWhere('vehicle.condition = :condition', { condition: 'used' });

    if (category && certified && !used && !approved && !trending)
      query
        .andWhere('vehicle.certified = :certified', { certified: true })
        .andWhere('vehicle.condition = :condition', { condition: 'used' });

    if (category && used) {
      query.orderBy('vehicle.updatedAt', 'DESC');
    } else if (category && trending && !approved && !used && !certified) {
      query
        .andWhere('vehicle.condition = :condition', { condition: 'new' })
        .orderBy('vehicle.totalView', 'DESC');
    } else {
      query.orderBy('vehicle.createdAt', 'DESC');
    }

    const vehicles = await query.take(10).getMany();

    return vehicles;
  }

  async forElectricInHomePage(
    type: string,
    userId: string,
    brandId: string,
    key: string,
  ): Promise<Array<HomePageElectric>> {
    const query = (await this.buildCommonVehicleQuery({ userId }))
      .addSelect('vehicle.type')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .leftJoinAndSelect('vehicle.model', 'model')
      .where('vehicle.type = :type', { type })
      .andWhere('vehicle.isElectric = :isElectric', { isElectric: true });
    if (brandId) {
      query
        .innerJoinAndSelect('vehicle.brand', 'brand')
        .andWhere('brand.id =:brandId', { brandId });
    }
    const vehicle = await query
      .take(10)
      .orderBy('vehicle.createdAt', 'DESC')
      .getMany();

    return vehicle;
  }

  async byBudget(
    minPrice: number,
    maxPrice: number | string,
    category: string,
    userId: string,
    key: string,
  ): Promise<Array<HomePageVehicle>> {
    const query = await this.buildCommonVehicleQuery({ category, userId });

    if (maxPrice && minPrice) {
      if (maxPrice == 'above') {
        query.andWhere('vehicle.minPrice >= :minPrice', { minPrice });
      } else {
        query.andWhere('vehicle.minPrice BETWEEN :minPrice AND :maxPrice', {
          minPrice,
          maxPrice,
        });
      }
    }
    const result = await query
      .take(10)
      .orderBy('vehicle.createdAt', 'DESC')
      .getMany();

    return result;
  }

  //to get all body types in homepage
  async getBodyTypeByCategory(
    category: string,
    bodyType: string,
    userId: string,
    brandId: string,
    key: string,
  ): Promise<{ bodyTypes: BodyTypeInterface[]; vehicles: VehicleInterface[] }> {
    const query = this.bodyTypeRepository.createQueryBuilder('bodyType');
    if (category)
      query.innerJoin(
        'bodyType.categories',
        'category',
        'category.slug = :category',
        { category },
      );
    query.select(['bodyType.bodyType', 'bodyType.slug', 'bodyType.image']);
    if (brandId) {
      query
        .leftJoinAndSelect('bodyType.models', 'models')
        .leftJoinAndSelect('models.brand', 'brand')
        .andWhere('brand.id = :brandId', { brandId });
    }
    const bodyTypes = await query.getMany();

    let vehicles = [];
    const bt: string = bodyType || bodyTypes[0]?.slug || '';
    if (!bt) {
      return { bodyTypes, vehicles: [] };
    }

    const vehiclequery = (await this.buildCommonVehicleQuery({ userId }))
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .where('bodyType.slug= :bodyType', { bodyType: bt });
    vehicles = await vehiclequery
      .orderBy('vehicle.createdAt', 'DESC')
      .take(10)
      .getMany();

    return { bodyTypes, vehicles };
  }

  //get all popular used vehicle
  async getPopularUsedVehicle(
    slugs: string,
    key: string,
  ): Promise<PopularUsedVehicles> {
    const allSlugs = JSON.parse(slugs);

    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoin('vehicle.category', 'category')
      .andWhere('category.slug IN (:...allSlugs)', { allSlugs })
      .select([
        'vehicle.name',
        'vehicle.slug',
        'vehicle.totalView',
        'category.slug',
        'vehicle.isElectric',
      ])
      .andWhere('vehicle.condition = :condition', { condition: 'used' });

    const popularVehicles = await queryBuilder.getMany();
    const categorizedVehicles: { [key: string]: string[] } = {};

    // Initialize categories for each slug in allSlugs
    allSlugs.forEach((slug: string) => {
      categorizedVehicles[slug] = [];
    });

    // Categorize vehicles based on slugs directly
    popularVehicles.forEach((vehicle) => {
      const categorySlug = vehicle.category.slug;
      if (allSlugs.includes(categorySlug)) {
        categorizedVehicles[categorySlug].push(vehicle.name);
      } else {
        console.log(`Unknown slug found: ${vehicle.slug}`);
      }
    });
    // Check for empty categories and insert all electric vehicles
    //as vehicle stores only one category but model can have multiple categories(car,ev)
    //avove is done according to category slug but only of car or bike and ev category is converted to
    //isElectric flag so again sorting by isElectric flag
    Object.keys(categorizedVehicles).forEach((category) => {
      if (categorizedVehicles[category].length === 0) {
        const electricVehicles = popularVehicles
          .filter((vehicle) => vehicle.isElectric)
          .map((vehicle) => vehicle.name);
        categorizedVehicles[category] = electricVehicles;
      }
    });

    return categorizedVehicles;
  }

  //get vehicle year according to model slug or anyothere
  async getVehicleYear(
    category: string,
    brand: string,
    model: string = null,
    key: string,
  ) {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select(['vehicle.year', 'vehicle.condition']);
    if (!brand && !category && model) {
      if (isUuidV4(model)) {
        query.innerJoin('vehicle.model', 'model', 'model.id = :modelId', {
          modelId: model,
        });
      } else {
        query.innerJoin('vehicle.model', 'model', 'model.slug = :slug', {
          slug: model,
        });
      }
    }

    if (!brand && !model && category) {
      if (isUuidV4(category)) {
        query.innerJoin(
          'vehicle.category',
          'category',
          'category.id = :categoryId',
          { categoryId: category },
        );
      } else {
        query.innerJoin(
          'vehicle.category',
          'category',
          'category.slug = :slug',
          { slug: category },
        );
      }
    }
    if (!category && !model && brand) {
      if (isUuidV4(category)) {
        query.innerJoin('vehicle.brand', 'brand', 'brand.id = :brandId', {
          brandId: brand,
        });
      } else {
        query.innerJoin('vehicle.brand', 'brand', 'brand.slug = :slug', {
          slug: brand,
        });
      }
    }
    const vehicleYear = await query
      .where('vehicle.condition = :condition', {
        condition: VehicleCondition.USED,
      })
      .getMany();
    const onlyYear = [...new Set(vehicleYear.map((v) => v.year))];
    const uniqueYears = Array.from(onlyYear);

    return uniqueYears;
  }

  //update vehicle approved
  async updateApproved(id: string): Promise<void> {
    const vehicle = await this.getOneVehicle(id);
    vehicle.approved = !vehicle.approved;
    await this.vehicleRepository.save(vehicle);
  }

  //update vehicle certified
  async updateCertified(id: string): Promise<void> {
    const vehicle = await this.getOneVehicle(id);
    if (vehicle.condition === VehicleCondition.NEW)
      throw new BadRequestException("Can't update certified for new vehicle!");
    vehicle.certified = !vehicle.certified;
    await this.vehicleRepository.save(vehicle);
  }

  //update vehicle upcoming
  async updateUpcoming(id: string): Promise<void> {
    const vehicle = await this.getOneVehicle(id);
    if (
      vehicle.condition === VehicleCondition.NEW &&
      vehicle.upcoming === false
    )
      throw new BadRequestException(
        "Can't update to upcoming for launched vehicle !",
      );
    if (vehicle.condition === VehicleCondition.USED)
      throw new BadRequestException("Can't update upcoming for used vehicle !");
    vehicle.upcoming = !vehicle.upcoming;
    await this.vehicleRepository.save(vehicle);
  }

  async getSimilarVehicleByCategory(
    category: string,
    bodyType: string,
    userId: string,
    vehicle: string,
    brand: string,
    key: string,
  ): Promise<Array<VehicleInterface>> {
    const vehicleQuery = await this.buildCommonVehicleQuery({
      category,
      userId,
    });

    if (bodyType) {
      vehicleQuery.leftJoinAndSelect('vehicle.bodyType', 'bodyType');
      if (isUuidV4(bodyType)) {
        vehicleQuery.andWhere('bodyType.id= :bodyType', { bodyType });
      } else {
        vehicleQuery.andWhere('bodyType.slug= :bodyType', { bodyType });
      }
    }
    if (brand) {
      vehicleQuery.leftJoinAndSelect('vehicle.brand', 'brand');
      if (isUuidV4(brand)) {
        vehicleQuery.andWhere('brand.id= :brand', { brand });
      } else {
        vehicleQuery.andWhere('brand.slug= :brand', { brand });
      }
    }
    if (vehicle && isUuidV4(vehicle))
      vehicleQuery.andWhere('vehicle.id != :vehicleId', { vehicle });
    if (vehicle)
      vehicleQuery.andWhere('vehicle.slug!= :vehicleSlug', {
        vehicleSlug: vehicle,
      });

    const vehicles = await vehicleQuery
      .orderBy('vehicle.createdAt', 'DESC')
      .take(10)
      .getMany();

    return vehicles;
  }

  //get upcoming vehicle by brand id or slug
  async getUpcomingVehicle(
    category: string,
    brand: string,
    userId: string,
    key: string,
  ): Promise<Array<HomePageVehicle>> {
    const query = await this.buildCommonVehicleQuery({
      category,
      userId,
      upcoming: true,
    });
    if (brand) {
      query.innerJoin('vehicle.brand', 'brand', 'brand.slug = :brandSlug', {
        brandSlug: brand,
      });
    }
    const vehicles = await query
      .addSelect(['vehicle.expectedLaunchDate'])
      .orderBy('vehicle.expectedLaunchDate', 'DESC')
      .getMany();

    return vehicles;
  }

  async buildCommonVehicleQuery(
    options: {
      category?: string;
      userId?: string;
      upcoming?: boolean;
    } = {},
  ) {
    const { category, userId, upcoming } = options;
    const query = this.vehicleRepository.createQueryBuilder('vehicle');
    if (upcoming !== undefined) {
      query.andWhere('vehicle.upcoming = true');
    } else {
      query.andWhere('vehicle.upcoming = false');
    }
    if (category) {
      query.innerJoin(
        'vehicle.category',
        'category',
        'category.slug = :category',
        { category },
      );
    }
    query.select([
      'vehicle.id',
      'vehicle.slug',
      'vehicle.name',
      'vehicle.minPrice',
      'vehicle.maxPrice',
      'vehicle.images',
      'vehicle.usedVehicleTotalMileage',
      'vehicle.batteryRange',
      'vehicle.batteryCapacity',
      'vehicle.transmission',
      'vehicle.condition',
      'vehicle.maxMileage',
      'vehicle.year',
      'vehicle.maxEngineDisplacement',
      'vehicle.condition',
      'vehicle.isElectric',
      'vehicle.maxBHP',
      'vehicle.torque',
      'vehicle.totalView',
      'vehicle.topSpeed',
      'vehicle.certified',
      'vehicle.createdAt',
      'vehicle.updatedAt',
    ]);

    if (userId) {
      query
        .leftJoinAndSelect('vehicle.favorites', 'fav')
        .where('fav.user.id = :userId OR fav.user.id IS NULL', { userId });
    }

    return query;
  }

  async getVehicleDetail(id: string, key: string) {
    const vehicle = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('vehicle.category', 'category')
      .leftJoinAndSelect('vehicle.favorites', 'favorites');
    if (isUuidV4(id)) {
      vehicle.where('vehicle.id=:id', { id });
    } else {
      vehicle.where('vehicle.slug=:slug', { slug: id });
    }
    const result = await vehicle.getOne();
    result.totalView++;
    await this.vehicleRepository.save(result);
    if (!result) throw new NotFoundException('Vehicle not found');

    return result;
  }

  async getVehicleDetailVariant(
    slug: string,
    fuelType: string,
    transmission: string,
    key: string,
  ) {
    try {
      const queryBuilder = this.variantRepository
        .createQueryBuilder('variant')
        .leftJoinAndSelect(
          'variant.engineAndTransmission',
          'engineAndTransmission',
        )
        .leftJoinAndSelect('variant.fuelAndPerformance', 'fuelAndPerformance')
        .leftJoinAndSelect(
          'variant.suspensionSteeringAndBrake',
          'suspensionSteeringAndBrake',
        )
        .leftJoinAndSelect(
          'variant.dimensionAndCapacity',
          'dimensionAndCapacity',
        )
        .leftJoinAndSelect('variant.motorAndBattery', 'motorAndBattery')
        .leftJoinAndSelect(
          'variant.comfortAndConvenience',
          'comfortAndConvenience',
        )
        .leftJoinAndSelect('variant.interior', 'interior')
        .leftJoinAndSelect('variant.exterior', 'exterior')
        .leftJoinAndSelect('variant.safetyAndFeatures', 'safetyAndFeatures')
        .leftJoinAndSelect(
          'variant.entertainmentAndCommunication',
          'entertainmentAndCommunication',
        )
        .leftJoinAndSelect('variant.category', 'category')
        .leftJoinAndSelect('variant.model', 'model')
        .innerJoin('variant.vehicles', 'vehicle')
        .where('vehicle.slug = :slug', { slug });

      if (fuelType) {
        queryBuilder.andWhere('fuelAndPerformance.fuelType = :fuelType', {
          fuelType,
        });
      }

      if (transmission) {
        queryBuilder.andWhere(
          'engineAndTransmission.transmission = :transmission',
          { transmission },
        );
      }

      const result = await queryBuilder.getMany();
      if (!result) throw new NotFoundException('Vehicle not found');

      return result;
    } catch (error) {
      throw new BadRequestException(
        'Vehicle could not be retrieved.',
        error.message,
      );
    }
  }

  async getUsedVehicleDetailPage(
    brandId: string,
    category: string,
    key: string,
  ) {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.variants', 'variant')
      .leftJoinAndSelect('variant.fuelAndPerformance', 'fuelAndPerformance')
      .leftJoinAndSelect('vehicle.model', 'model')
      .andWhere('vehicle.condition = :condition', {
        condition: VehicleCondition.USED,
      });

    if (brandId) {
      query
        .leftJoinAndSelect('vehicle.brand', 'brand')
        .andWhere('brand.id = :brandId', { brandId });
    }
    if (category) {
      query
        .leftJoin('vehicle.category', 'category')
        .andWhere('category.slug = :category', { category });
    }
    const vehicles = await query
      .select([
        'variant.id',
        'variant.variant',
        'variant.slug',
        'variant.price',
        'fuelAndPerformance.fuelType',
        'vehicle',
        'model.id',
        'model.slug',
        'model.model',
        'brand.id',
        'brand.slug',
        'brand.brand',
      ])
      .getMany();
    if (!vehicles)
      throw new BadRequestException(
        'Vehicles with the brand could not be found.',
      );

    return vehicles;
  }

  async filterListing(
    condition: string,
    brand: string[],
    model: string[],
    minYear: number,
    maxYear: number,
    fuelType: string[],
    bodyType: BodyType[],
    transmission: string[],
    seats: number[],
    colors: string[],
    features: string[],
    minPrice: number[],
    maxPrice: number[],
    key: string,
  ) {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('brand.models', 'model')
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .leftJoinAndSelect('vehicle.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color');

    if (condition) {
      queryBuilder.andWhere('vehicle.condition = :condition', { condition });
    }

    if (brand?.length > 0) {
      queryBuilder.andWhere('brand.slug IN (:...brand)', { brand });
    }

    if (model?.length > 0) {
      queryBuilder.andWhere('model.slug IN (:...model)', { model });
    }

    if (minYear && maxYear) {
      queryBuilder.andWhere('vehicle.year BETWEEN :minYear AND :maxYear', {
        minYear,
        maxYear,
      });
    }
    if (minPrice && maxPrice) {
      queryBuilder.andWhere(
        'vehicle.minPrice <= :maxPrice AND vehicle.maxPrice >= :minPrice',
        {
          minPrice,
          maxPrice,
        },
      );
    }

    if (fuelType?.length > 0) {
      queryBuilder.andWhere('vehicle.fuelType IN (:...fuelType)', { fuelType });
    }

    if (bodyType?.length > 0) {
      queryBuilder.andWhere('bodyType.slug IN (:...bodyType)', { bodyType });
    }

    if (transmission?.length > 0) {
      queryBuilder.andWhere('vehicle.transmission IN (:...transmission)', {
        transmission,
      });
    }

    if (seats?.length > 0) {
      queryBuilder.andWhere('vehicle.seats IN (:...seats)', { seats });
    }

    if (features?.length > 0) {
      queryBuilder.andWhere('vehicle.features IN (:...features)', { features });
    }

    if (colors?.length > 0) {
      const colorIds = [];
      const availableColor = await this.availableColorRepo
        .createQueryBuilder('availableColor')
        .innerJoinAndSelect('availableColor.color', 'color')
        .where('color.slug IN (:...colors)', { colors })
        .getMany();
      availableColor.forEach((color) => {
        colorIds.push(color.id);
      });
      queryBuilder.andWhere('availableColors.id IN (:...colorIds)', {
        colorIds,
      });
    }

    const receivedVehicles = await queryBuilder.getMany();

    return receivedVehicles;
  }

  //for image gallery page
  async vehicleAllImages(
    vehicle: string,
    key: string,
  ): Promise<VehicleImageInterface> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color')
      .select([
        'vehicle.id',
        'vehicle.slug',
        'vehicle.images',
        'vehicle.exteriorImages',
        'vehicle.interiorImages',
        'vehicle.view360',
        'vehicle.video',
        'availableColors',
        'color',
      ]);

    if (isUuidV4(vehicle)) query.where('vehicle.id = :vehicle', { vehicle });
    else query.where('vehicle.slug = :vehicle', { vehicle });
    const vehicleImages = await query.getOne();

    return vehicleImages;
  }

  //to update vehicle from model when model is updated (when updating model update changes in vehicle also)
  async updateVehicleFromModel(
    brand: BrandWithCategory,
    model: ModelInterface,
    bodyType: BodyTypeWithCategory,
  ): Promise<void> {
    //TO UPDATE VEHICLE IF IT IS CREATED
    const allVehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.model = :modelId', { modelId: model.id })
      .getMany();

    // if (checkModel.availableColors && checkModel.availableColors.length > 0) {
    //   if (condition === VehicleCondition.USED) {
    //     const usedVehicleColor = checkModel.availableColors.find((ac) => ac.id === availableColor);

    //     if (usedVehicleColor) {
    //       const newAvColor = this.availableColorRepo.create({
    //         ...usedVehicleColor,
    //         vehicle: createVehicle,
    //       });
    //       await this.availableColorRepo.save(newAvColor);
    //     }
    //   } else if (condition === VehicleCondition.NEW) {
    //     const allColors = checkModel.availableColors.map(async (ac) => {
    //       const newAvColor = this.availableColorRepo.create({
    //         ...ac,
    //         id: ac.id,
    //         vehicle: createVehicle,
    //       });
    //       return this.availableColorRepo.save(newAvColor);
    //     });

    //     await Promise.all(allColors);
    //   }
    // }

    //   if (condition === VehicleCondition.USED && existingVehicle?.availableColors[0]?.id !== availableColor) {
    //     const existingAvailableColorId = existingVehicle.availableColors[0]?.id;
    //     //if used vehicle already has available color remove its association with vehicle
    //     if (existingAvailableColorId) {
    //       await this.availableColorRepo
    //         .createQueryBuilder()
    //         .update('avcolor')
    //         .set({ vehicleId: null })
    //         .where('avcolor.id =:id', { id: existingVehicle.availableColors[0].id })
    //         .execute();
    //     }
    //     //add   available color  to vehicle
    //     await this.availableColorRepo
    //       .createQueryBuilder()
    //       .update('available_color')
    //       .set({ vehicle: id })
    //       .where('available_color.id = :id', { id: availableColor })
    //       .execute();
    //   }

    if (allVehicles.length > 0) {
      //update available color

      //update vehicle
      const updateVehicles = allVehicles.map(async (vehicle) => {
        const vehicleObject = {
          name:
            vehicle.condition === VehicleCondition.NEW
              ? await vehicleName(brand.brand, model.model)
              : vehicle.name,
          year: model.year,
          bodyType,
          brand,
          id: vehicle.id,
        };
        return this.vehicleRepository.save(vehicleObject);
      });
      await Promise.all(updateVehicles);
    }
  }

  async getNewVehicleDetailPage(
    category: string,
    bodyType: string,
    userId: string,
    brandId: string,
    key: string,
  ): Promise<{ bodyTypes: BodyTypeInterface[]; vehicles: VehicleInterface[] }> {
    const query = this.bodyTypeRepository.createQueryBuilder('bodyType');
    if (category)
      query.innerJoin(
        'bodyType.categories',
        'category',
        'category.slug = :category',
        { category },
      );
    query.select(['bodyType.bodyType', 'bodyType.slug', 'bodyType.image']);

    if (brandId) {
      query
        .leftJoin('bodyType.models', 'models')
        .leftJoin('models.brand', 'brand');
      if (isUuidV4(brandId)) {
        query.andWhere('brand.id = :brandId', { brandId });
      } else {
        query.andWhere('brand.slug = :brandId', { brandId });
      }
    }
    const bodyTypes = await query.getMany();

    let vehicles = [];
    const bt: string = bodyType || bodyTypes[0]?.slug || '';
    if (!bt) {
      return { bodyTypes, vehicles: [] };
    }
    const vehicleQuery = (await this.buildCommonVehicleQuery({ userId }))
      .leftJoinAndSelect('vehicle.bodyType', 'bodyType')
      .leftJoinAndSelect('vehicle.variants', 'variants')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .where('bodyType.slug= :bodyType', { bodyType: bt })
      .andWhere('vehicle.condition=:condition', {
        condition: VehicleCondition.NEW,
      });

    if (brandId) {
      if (isUuidV4(brandId)) {
        vehicleQuery.andWhere('brand.id = :brandId', { brandId });
      } else {
        vehicleQuery.andWhere('brand.slug = :brandId', { brandId });
      }
    }

    vehicles = await vehicleQuery
      .orderBy('vehicle.createdAt', 'DESC')
      .take(10)
      .getMany();

    return { bodyTypes, vehicles };
  }
}
