import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatType, CheckData, applyPagination } from 'src/utils/common';
import { Category } from 'src/utils/entities';

import { Repository } from 'typeorm';
import { AllCategories, CategoryInterface } from './category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly checkData: CheckData,
  ) {}

  //get all categories
  async getAllCategory(
    page: number,
    limit: number,
    search: string,
    type: string,
    all: boolean,
    key: string,
  ): Promise<AllCategories> {
    //to find all categories from database
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.createdAt', 'DESC');

    //for search
    if (!all && search) {
      query.where(
        'LOWER(category.name) ILIKE :search OR LOWER(CAST(category.type AS text)) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }

    if (!all && !search && type) {
      query.andWhere('LOWER(CAST(category.type AS text)) = :search', {
        search: `${type.toLocaleLowerCase()}`,
      });
    }

    //get total count
    const total = await query.getCount();

    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );

    const categories = await PaginatedQuery.getMany();
    return { categories, pagination };
  }

  //to find category by given id
  async getCategoryById(id: string): Promise<CategoryInterface> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found');
    return category;
  }

  //function to get electric category
  async getElectricCategory(): Promise<CategoryInterface> {
    const electricCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.type = :type', { type: CatType.ELECTRIC })
      .getOne();

    if (!electricCategory) {
      throw new NotFoundException('EV category not found');
    }

    return electricCategory;
  }

  //to add new category
  async createNewCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<CategoryInterface> {
    const { name, type } = categoryDto;
    //to check duplicate category name
    await this.checkData.checkDuplicateName(
      this.categoryRepository,
      'name',
      name,
    );
    if (type === CatType.ELECTRIC) {
      //to check electric type
      const check = await this.categoryRepository.findOneBy({
        type: CatType.ELECTRIC,
      });
      if (check)
        throw new NotAcceptableException('Already has a electric category');
    }
    const newCategory = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  //update category by given id
  async updateCategoryById(
    id: string,
    categoryDto: UpdateCategoryDto,
  ): Promise<CategoryInterface> {
    const { name, type } = categoryDto;
    //to check duplicate category name
    await this.checkData.checkDuplicateName(
      this.categoryRepository,
      'name',
      name,
      id,
    );
    await this.getCategoryById(id);
    if (type === CatType.ELECTRIC) {
      //to check electric type
      const check = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.type = :catType', { catType: CatType.ELECTRIC })
        .andWhere('NOT category.id = :id', { id: id })
        .getOne();
      if (check)
        throw new NotAcceptableException(
          'Already has a electric category,Cannot create a new one',
        );
    }
    const category = this.categoryRepository.create({ ...categoryDto, id: id });
    const savedCategory = await this.categoryRepository.save(category);
    return savedCategory;
  }

  async getCategoryForHomePage(): Promise<CategoryInterface[]> {
    const category = await this.categoryRepository.find({
      where: [{ slug: 'car' }, { slug: 'bike' }, { slug: 'scooter' }],
    });
    return category;
  }

  //to delete category by its id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteCategoryById(id: string): Promise<any> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.variants', 'variants')
      .leftJoinAndSelect('category.bodyTypes', 'bodyTypes')
      .leftJoinAndSelect('category.brands', 'brands')
      .leftJoinAndSelect('category.models', 'models')
      .leftJoinAndSelect('category.vehicles', 'vehicles')
      .leftJoinAndSelect('category.vehicleRequirements', 'vehicleRequirements')
      .leftJoinAndSelect('category.vehicleDetails', 'vehicleDetails')
      .where('category.id =:id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    // Check for related dependencies
    interface DataStructure {
      brands?: Array<{ id: string; name: string }>;
      models?: Array<{ id: string; name: string }>;
      variants?: Array<{ id: string; name: string }>;
      bodyTypes?: Array<{ id: string; name: string }>;
      vehicles?: Array<{ id: string; name: string }>;
      vehicleDetails?: Array<{ id: string }>;
      vehicleRequirements?: Array<{ id: string }>;
    }
    const data: DataStructure = {};

    if (category.brands?.length > 0) {
      const brandDependencies = category.brands.map((brand) => ({
        id: brand.id,
        name: brand.brand,
      }));
      data.brands = brandDependencies;
    }
    if (category.bodyTypes?.length > 0) {
      const bodyTypeDependencies = category.bodyTypes.map((bt) => ({
        id: bt.id,
        name: bt.bodyType,
      }));
      data.bodyTypes = bodyTypeDependencies;
    }

    if (category.models?.length > 0) {
      const modelDependencies = category.models.map((model) => ({
        id: model.id,
        name: model.model,
      }));

      data.models = modelDependencies;
    }
    if (category.variants?.length > 0) {
      const vehicleDependencies = category.variants.map((v) => ({
        id: v.id,
        name: v.variant,
      }));
      data.variants = vehicleDependencies;
    }

    if (category.vehicles?.length > 0) {
      const vehicleDependencies = category.vehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
      }));
      data.vehicles = vehicleDependencies;
    }
    if (category.vehicleDetails?.length > 0) {
      const detailDependencies = category.vehicleDetails.map((d) => ({
        id: d.id,
      }));
      data.vehicleDetails = detailDependencies;
    }

    if (category.vehicleRequirements?.length > 0) {
      const Dependencies = category.vehicleRequirements.map((r) => ({
        id: r.id,
      }));
      data.vehicleRequirements = Dependencies;
    }
    if (Object.keys(data).length > 0) {
      return data;
    }

    // Proceed with deleting the category
    await this.categoryRepository.remove(category);
    return true;
  }

  // category featured update
  async featuredUpdate(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    if (!category) throw new NotFoundException('Category not found');
    if (category.featured) {
      category.featured = false;
      await this.categoryRepository.save(category);
    } else {
      const query = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.featured=:featured', { featured: true })
        .getCount();
      if (query >= 3)
        throw new BadRequestException(`3 Categoiries already featured !`);
      category.featured = true;
      await this.categoryRepository.save(category);
    }
  }

  // category searchable update
  async searchableUpdate(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    if (!category) throw new NotFoundException('Category not found');
    if (category.searchable) {
      category.searchable = false;
      await this.categoryRepository.save(category);
    } else {
      const query = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.searchable=:searchable', { searchable: true })
        .getCount();
      if (query >= 4)
        throw new BadRequestException(`4 Categoiries already searchable!`);
      category.searchable = true;
      await this.categoryRepository.save(category);
    }
  }

  //get serchable categories
  async serchableCategories(): Promise<Array<CategoryInterface>> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.searchable = true')
      .orderBy('category.slug')
      .getMany();
    return category;
  }
}
