import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyTypeService } from 'src/bodyTypes/bodyType.service';
import { BrandService } from 'src/brands/brand.service';
import { CategoryService } from 'src/category/category.service';
import { CheckData, CatType, applyPagination } from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import {
  Model,
  Variant,
  Vehicle,
  Brand,
  AvailableColor,
  BodyType,
} from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import {
  ModelInterface,
  ALlModels,
  ModelPopulated,
  AvailableColorInterface,
} from 'src/utils/interfaces';

import { Repository } from 'typeorm';
import { CreateModelDto, UpdateModelDto } from './model.dto';
import { AvailableColorService } from 'src/availableColors/availableColor.service';
import { VehicleService } from 'src/vehicles/vehicle.service';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    // @InjectRepository(Category)
    // private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(AvailableColor)
    private readonly availableColorRepository: Repository<AvailableColor>,
    @InjectRepository(BodyType)
    private readonly btRepository: Repository<BodyType>,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly bodyTypeService: BodyTypeService,
    private readonly checkData: CheckData,
    private readonly availableColorService: AvailableColorService,
    @Inject(forwardRef(() => VehicleService))
    private readonly vehicleService: VehicleService,
  ) {}

  //get all models with pagination and search
  async getAllModels(
    page: number,
    limit: number,
    category: string,
    brand: string,
    color: string,
    year: number,
    isElectric: boolean,
    search: string,
    all: boolean,
  ): Promise<ALlModels> {
    const query = this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('model.bodyType', 'bodyType')
      .leftJoinAndSelect('model.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color')
      // .leftJoinAndSelect('model.availableColors', 'availableColors')
      .where('NOT category.type = :type', { type: CatType.ELECTRIC })
      .orderBy('model.createdAt', 'DESC');
    // for search
    if (!all && search) {
      query.where(
        'LOWER(model.model) ILIKE :search OR LOWER(brand.brand) ILIKE :search OR LOWER(category.name) ILIKE :search OR LOWER(color.name) ILIKE :search OR CAST(model.year AS text) ILIKE :search ',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
      // to parse the search value as an integer
      const searchYear = parseInt(search.trim());

      // Check  the parsed value is a number
      if (!isNaN(searchYear)) {
        query.orWhere('model.year = :searchYear', { searchYear });
      }
    }

    // Apply search filter if provided
    if (!all && !search && year) {
      query.andWhere('model.year = :year', { year });
    }
    if (!all && !search && isElectric) {
      query.andWhere('model.isElectric = :isElectric', { isElectric });
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
    if (!all && !search && color) {
      const colorKey = isUuidV4(color) ? 'id' : 'slug';
      query.andWhere(`color.${colorKey} = :colorValue`, {
        colorValue: color,
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

    const models = await PaginatedQuery.getMany();
    return { models, pagination };
  }

  async getAllModelsAdmin(
    page: number,
    limit: number,
    category: string,
    brand: string,
    color: string,
    year: number,
    isElectric: boolean,
    search: string,
    all: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ALlModels> {
    const query = this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('model.bodyType', 'bodyType')
      .leftJoinAndSelect('model.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color')
      // .leftJoinAndSelect('model.availableColors', 'availableColors')
      .where('NOT category.type = :type', { type: CatType.ELECTRIC })
      .orderBy('model.createdAt', 'DESC');
    // for search
    if (!all && search) {
      query.where(
        'LOWER(model.model) ILIKE :search OR LOWER(brand.brand) ILIKE :search OR LOWER(category.name) ILIKE :search OR LOWER(color.name) ILIKE :search OR CAST(model.year AS text) ILIKE :search ',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
      // to parse the search value as an integer
      const searchYear = parseInt(search.trim());

      // Check  the parsed value is a number
      if (!isNaN(searchYear)) {
        query.orWhere('model.year = :searchYear', { searchYear });
      }
    }

    // Apply search filter if provided
    if (!all && !search && year) {
      query.andWhere('model.year = :year', { year });
    }
    if (!all && !search && isElectric) {
      query.andWhere('model.isElectric = :isElectric', { isElectric });
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
    if (!all && !search && color) {
      const colorKey = isUuidV4(color) ? 'id' : 'slug';
      query.andWhere(`color.${colorKey} = :colorValue`, {
        colorValue: color,
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

    const models = await PaginatedQuery.getMany();
    return { models, pagination };
  }

  //get model by model id
  async getModelById(id: string): Promise<ModelPopulated> {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('model.bodyType', 'bodyType')
      // .leftJoinAndMapMany(
      //   'model.availableColors',
      //   AvailableColor,
      //   'availableColors',
      //   'availableColors.modelId = model.id'
      // )
      .leftJoinAndSelect('model.availableColors', 'availableColors')
      .leftJoinAndSelect('availableColors.color', 'color')
      .where('NOT category.type = :type', { type: CatType.ELECTRIC })
      .where('model.id=:id', { id })
      .getOne();
    if (!model) throw new NotFoundException('Model not found');
    model.totalView++;
    const result = await this.modelRepository.save(model);
    return result;
  }

  //   create a new model
  async createModel(createModelDto: CreateModelDto): Promise<ModelInterface> {
    const { model, category, brand, isElectric, bodyType, availableColors } =
      createModelDto;
    await this.checkData.checkDuplicateName(
      this.modelRepository,
      'model',
      model,
    );
    //check if all categories exists or not
    const [categoryCheck, brandCheck, bodyTypeCheck] = await Promise.all([
      this.categoryService.getCategoryById(category),
      this.brandService.getBrandById(brand),
      this.bodyTypeService.getBodyTypeById(bodyType),
    ]);
    if (!brandCheck.categories.some((cat) => cat.id === category)) {
      throw new NotAcceptableException(
        `Given brand ${brand} doesn't have ${category} category`,
      );
    }

    createModelDto.category = isElectric
      ? [categoryCheck, await this.categoryService.getElectricCategory()]
      : [categoryCheck];

    createModelDto.brand = brandCheck;
    createModelDto.bodyType = bodyTypeCheck;
    const newModel = this.modelRepository.create(createModelDto);
    const createdModel = await this.modelRepository.save(newModel);

    //for adding available colors
    await this.availableColorService.createAvailableColors(
      createdModel,
      availableColors,
    );

    return await this.getModelById(createdModel.id);
  }

  //update model by model id
  async updateModel(
    id: string,
    updateModelDto: UpdateModelDto,
  ): Promise<ModelInterface> {
    const { category, model, brand, bodyType, isElectric, availableColors } =
      updateModelDto;

    // const existingModel = await this.getModelById(id);
    const existingModel = await this.modelRepository.findOneBy({ id });

    // Check for duplicate model name
    await this.checkData.checkDuplicateName(
      this.modelRepository,
      'model',
      model,
      id,
    );

    // Check if all categories exist or not
    const [checkCategory, checkBrand, checkBodyType] = await Promise.all([
      this.categoryService.getCategoryById(category),
      this.brandService.getBrandById(brand),
      this.bodyTypeService.getBodyTypeById(bodyType),
    ]);

    // Check if the brand has the specified category
    if (!checkBrand.categories.some((cat) => cat.id === category)) {
      throw new NotAcceptableException(
        `Given brand ${brand} doesn't have ${category} category`,
      );
    }

    //ensure that isElectric is not updated
    if (isElectric !== existingModel.isElectric) {
      throw new NotAcceptableException('Cannot update electric type');
    }

    // Update available colors

    const updateModel = {
      ...updateModelDto,
      brand: checkBrand,
      bodyType: checkBodyType,
      category: updateModelDto.isElectric
        ? [checkCategory, await this.categoryService.getElectricCategory()]
        : [checkCategory],
      slug: await updateSlug(updateModelDto.model),
      id,
    };
    const updatedModel = await this.modelRepository.save(updateModel);
    // Update available colors
    await this.availableColorService.updateAvailableColors(
      updatedModel,
      availableColors,
    );
    await this.vehicleService.updateVehicleFromModel(
      checkBrand,
      updatedModel,
      checkBodyType,
    );
    return await this.getModelById(id);
  }

  //to delete a model by model id
  async deleteModel(id: string): Promise<void> {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.variants', 'variants')
      .leftJoinAndSelect('model.vehicles', 'vehicles')
      .leftJoinAndSelect('model.bodyType', 'bodyType')
      .leftJoinAndSelect('model.availableColors', 'availableColors')
      .leftJoinAndSelect('model.category', 'category')
      // .select(['model.variants', 'model.vehicles', 'model.category', 'model.brand'])
      .where('model.id =:id', { id })
      .getOne();
    if (!model) {
      throw new NotFoundException('Model not found');
    }

    const bodyType = await this.btRepository
      .createQueryBuilder('bt')
      .leftJoinAndSelect('bt.models', 'models')
      .where('bt.id = :id', { id: model.bodyType.id })
      .getOne();

    if (bodyType) {
      bodyType.models = bodyType.models.filter((m) => m.id !== id);

      // Update the BodyType entity in the database
      await this.btRepository.save(bodyType);
    }

    // Delete associated variants
    await Promise.all(
      model.variants.map((variant) => this.variantRepository.remove(variant)),
    );

    // Remove associations from vehicles
    await Promise.all(
      model.vehicles.map((vehicle) => {
        this.vehicleRepository.remove(vehicle);
      }),
    );

    //delete from available color table too
    await this.availableColorRepository
      .createQueryBuilder()
      .delete()
      .where('modelId = :modelId', { modelId: id })
      .execute();

    // Clear brand association
    if (model.brand) {
      model.brand.models = model.brand.models.filter((m) => m.id !== id);
      await this.brandRepository.save(model.brand);
    }
    // Clear vehicle associations from model
    model.vehicles = [];

    // Delete the model
    await this.modelRepository.remove(model);
  }

  async getAvailableColor(id: string): Promise<Array<AvailableColorInterface>> {
    const availableColor = await this.availableColorRepository
      .createQueryBuilder('col')
      .leftJoinAndSelect('col.color', 'color')
      .where('col.model = :id', { id })
      .getMany();

    return availableColor;
  }
}
