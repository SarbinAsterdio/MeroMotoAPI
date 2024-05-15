import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckData, applyPagination } from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import { BodyType, Vehicle, Category } from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import { VehicleInterface } from 'src/utils/interfaces';

import { Repository } from 'typeorm';
import { CreateBodyTypeDto, UpdateBodyTypeDto } from './bodyType.dto';
import {
  AllBodyType,
  BodyTypeWithCategory,
  BodyTypeInterface,
} from './bodyType.interface';

@Injectable()
export class BodyTypeService {
  constructor(
    @InjectRepository(BodyType)
    private readonly bodyTypeRepository: Repository<BodyType>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly checkData: CheckData,
  ) {}

  async getAllBodyTypes(
    page: number,
    limit: number,
    search: string,
    bodyType: string,
    category: string,
    all: boolean,
    key: string,
  ): Promise<AllBodyType> {
    // all data get option
    const query = this.bodyTypeRepository
      .createQueryBuilder('bodyType')
      .leftJoinAndSelect('bodyType.categories', 'categories')
      .orderBy('bodyType.createdAt', 'DESC');
    // Apply search filter if provided
    if (!all && search) {
      query.where(
        'LOWER(bodyType.bodyType) ILIKE :search OR LOWER(categories.name) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }

    if (!all && !search && category) {
      if (isUuidV4(category)) {
        query.andWhere('categories.id = :categoryId', { categoryId: category });
      } else {
        query.andWhere('categories.slug = :slug', { slug: category });
      }
    }
    // Get the total count of body type
    const total = await query.getCount();
    //apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );
    const bodyTypes = await PaginatedQuery.getMany();
    return { bodyTypes, pagination };
  }

  async getBodyTypeById(id: string): Promise<BodyTypeWithCategory> {
    const bodyType = await this.bodyTypeRepository
      .createQueryBuilder('bodyType')
      .leftJoinAndSelect('bodyType.categories', 'categories')
      .where('bodyType.id = :id', { id })
      .getOne();
    if (!bodyType) throw new NotFoundException('BodyType not found');
    return bodyType;
  }

  async createBodyType(
    createBodyTypeDto: CreateBodyTypeDto,
  ): Promise<BodyTypeInterface> {
    const { bodyType, categories } = createBodyTypeDto;

    // check the bodytype already exits
    await this.checkData.checkDuplicateName(
      this.bodyTypeRepository,
      'bodyType',
      bodyType,
    );

    //   check category exits or not
    const checkCategories = await this.checkData.checkCategory(categories);
    createBodyTypeDto.categories = checkCategories;
    const newBodyType = this.bodyTypeRepository.create(createBodyTypeDto);
    return await this.bodyTypeRepository.save(newBodyType);
  }

  async updateBodyType(
    id: string,
    updateBodyTypeDto: UpdateBodyTypeDto,
  ): Promise<BodyTypeInterface> {
    const { bodyType, categories } = updateBodyTypeDto;
    await this.checkData.checkDuplicateName(
      this.bodyTypeRepository,
      'bodyType',
      bodyType,
      id,
    );

    //   check category exits or not
    const checkCategories = await this.checkData.checkCategory(categories);

    updateBodyTypeDto.id = id;
    updateBodyTypeDto.categories = checkCategories;
    updateBodyTypeDto.slug = await updateSlug(bodyType);

    await this.bodyTypeRepository.save(updateBodyTypeDto);
    return await this.bodyTypeRepository.findOneBy({ id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteBodyType(id: string): Promise<any> {
    const bodyType = await this.bodyTypeRepository
      .createQueryBuilder('bt')
      .leftJoinAndSelect('bt.categories', 'categories')
      .leftJoinAndSelect('bt.vehicles', 'vehicles')
      .where('bt.id=:id', { id })
      .getOne();
    if (!bodyType) {
      throw new NotFoundException(`Body Type with ID ${id} not found.`);
    }
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.bodyTypes', 'bodyTypes')
      .getMany();

    // Check if there are associated models or vehicles
    interface DataStructure {
      vehicles?: Array<{ id: string; name: string }>;
    }
    const data: DataStructure = {};

    if (bodyType.vehicles?.length > 0) {
      const Dependencies = bodyType.vehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
      }));
      data.vehicles = Dependencies;
    }

    if (Object.keys(data).length > 0) {
      return data;
    }

    categories.forEach((category) => {
      category.bodyTypes.filter((bt) => bt.id !== id);
    });

    bodyType.categories = [];
    await Promise.all([
      this.categoryRepository.save(categories),
      this.bodyTypeRepository.save(bodyType),
    ]);

    await this.bodyTypeRepository.remove(bodyType);
    return true;
  }

  //to get all body types in homepage
  async getBodyTypeByCategory(
    category: string,
    bodyType: string,
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

    query.select([
      'bodyType.id',
      'bodyType.bodyType',
      'bodyType.slug',
      'bodyType.image',
    ]);
    const bodyTypes = await query.getMany();

    let vehicles = [];

    bodyType = bodyType || bodyTypes ? bodyTypes[0].slug : '';
    if (bodyType)
      vehicles = await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .innerJoin('vehicle.bodyType', 'bodyType')
        .where('bodyType.slug= :bodyType', { bodyType })
        // .select([
        //   'vehicle.id',
        //   'vehicle.name',
        //   'vehicle.slug',
        //   'vehicle.images',
        //   'vehicle.minPrice',
        //   'vehicle.maxPrice',
        //   'vehicle.year',
        // ])
        .getMany();
    return { bodyTypes, vehicles };
  }
}
