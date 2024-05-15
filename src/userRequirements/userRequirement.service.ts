import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brands/brand.service';
import { CategoryService } from 'src/category/category.service';
import { ModelService } from 'src/models/model.service';
import { UserService } from 'src/users/user.service';
import { applyPagination } from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import { VehicleRequirement } from 'src/utils/entities';

import { Repository } from 'typeorm';
import {
  CreateVehicleRequirementDto,
  UpdateVehicleRequirementDto,
} from './userRequirement.dto';
import {
  AllVehicleRequirements,
  VehicleRequirementPopulated,
} from './userRequirement.interface';

@Injectable()
export class UserRequirementService {
  constructor(
    @InjectRepository(VehicleRequirement)
    private readonly vehicleRequirementRepo: Repository<VehicleRequirement>,
    private readonly brandService: BrandService,
    private readonly modelService: ModelService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  //get all the vehicle requirements
  async findAll(
    page: number,
    limit: number,
    category: string,
    search: string,
    brand: string,
    model: string,
    description: string,
    transmission: string,
    name: string,
    email: string,
    phoneNumber: number,
    year: number,
    minBudget: number,
    maxBudget: number,
    all: string,
  ): Promise<AllVehicleRequirements> {
    const query = this.vehicleRequirementRepo
      .createQueryBuilder('requirements')
      .leftJoinAndSelect('requirements.category', 'category')
      .leftJoinAndSelect('requirements.brand', 'brand')
      .leftJoinAndSelect('requirements.model', 'model')
      .leftJoinAndSelect('requirements.user', 'user')
      .orderBy('requirements.createdAt', 'DESC');

    if (!all && search) {
      query.where(
        'LOWER(brand.brand) ILIKE :search OR LOWER(model.model) ILIKE :search OR LOWER(category.name) ILIKE :search OR LOWER(details.description) ILIKE :search OR LOWER(details.transmission) ILIKE :search OR LOWER(details.name) ILIKE :search OR LOWER(details.email) ILIKE :search OR CAST(details.phoneNumber AS text) ILIKE :search OR CAST(details.year AS text) ILIKE :search OR CAST(details.minBudget AS text) ILIKE :search OR CAST(details.maxBudget AS text) ILIKE :search',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
    }
    // Apply search filter if provided

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
    if (!all && !search && description) {
      query.andWhere('LOWER(requirements.description) = :search', {
        search: `${description.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && transmission) {
      query.andWhere('LOWER(requirements.transmission) = :search', {
        search: `${transmission.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && name) {
      query.andWhere('LOWER(requirements.name) = :search', {
        search: `${name.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && email) {
      query.andWhere('LOWER(requirements.email) = :search', {
        search: `${email.toLocaleLowerCase()}`,
      });
    }
    if (!all && !search && phoneNumber) {
      query.andWhere('CAST(requirements.phoneNumber AS text) = :search', {
        search: `${phoneNumber}`,
      });
    }
    if (!all && !search && year) {
      query.andWhere('CAST(requirements.year AS text) = :search', {
        search: `${year}`,
      });
    }
    if (!all && !search && minBudget && maxBudget) {
      query.andWhere(
        'requirements.minBudget <= :maxBudget AND requirements.maxBudget >= :minBudget',
        {
          minBudget,
          maxBudget,
        },
      );
    }

    //get total count
    const total = await query.getCount();

    //apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      limit,
      total,
    );

    const results = await PaginatedQuery.getMany();
    return { results, pagination };
  }
  //get one requirement using requirement id
  async getOneById(id: string): Promise<VehicleRequirementPopulated> {
    const oneRequirement = await this.vehicleRequirementRepo
      .createQueryBuilder('requirements')
      .leftJoinAndSelect('requirements.category', 'category')
      .leftJoinAndSelect('requirements.brand', 'brand')
      .leftJoinAndSelect('requirements.model', 'model')
      .leftJoinAndSelect('requirements.user', 'user')
      .where('requirements.id=:id', { id })
      .getOne();
    if (!oneRequirement)
      throw new NotFoundException('Vehicle Requirement not found');
    return oneRequirement;
  }

  //add a new vehicle
  async addNewRequirement(
    createRequirementDto: CreateVehicleRequirementDto,
  ): Promise<VehicleRequirementPopulated> {
    const { category, brand, model } = createRequirementDto;

    const [checkCategory, checkBrand, checkModel] = await Promise.all([
      this.categoryService.getCategoryById(category),
      this.brandService.getBrandById(brand),
      this.modelService.getModelById(model),
    ]);
    const updatedDto = {
      ...createRequirementDto,
      category: checkCategory,
      model: checkModel,
      brand: checkBrand,
    };
    const addNewRequirement = this.vehicleRequirementRepo.create(updatedDto);
    const createVehicle =
      await this.vehicleRequirementRepo.save(addNewRequirement);
    return createVehicle;
  }

  //update vehicle by vehicle id
  async updateRequirement(
    id: string,
    updateRequirementDto: UpdateVehicleRequirementDto,
  ): Promise<VehicleRequirementPopulated> {
    const checkRequirement = await this.getOneById(id);

    const createVehicle = await this.vehicleRequirementRepo.save({
      ...checkRequirement,
      ...updateRequirementDto,
      id,
    });
    return createVehicle;
  }

  //delete requirements By requirement id
  async deleteRequirement(id: string) {
    await this.getOneById(id);
    await this.vehicleRequirementRepo.delete(id);
  }
}
