import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { CheckData, applyPagination } from 'src/utils/common';
import { BrandInterface, BrandWithCategory } from './brand.interface';
import { Pagination } from 'src/utils/interfaces';
import { isUuidV4 } from 'src/utils/dtos';
import {
  CreateBrandDto,
  UpdateBrandDto,
  UpdateFeaturedAndPosition,
} from './brand.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly categoryService: CategoryService,
    private readonly checkData: CheckData,
  ) {}

  //get all brands with pagination and search
  async getAllBrands(
    page: number,
    limit: number,
    category: string,
    search: string,
    all: boolean,
    key: string,
  ): Promise<{ brands: BrandWithCategory[]; pagination: Pagination }> {
    const query = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.categories', 'categories')
      .orderBy('brand.createdAt', 'DESC');

    //for search
    if (!all && search) {
      query.where(
        'LOWER(brand.brand) ILIKE :search OR LOWER(categories.name) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }

    // For homepage: Get all brands according to the specified category
    if (!all && !search && category) {
      if (isUuidV4(category)) {
        query.andWhere('categories.id = :categoryId', { categoryId: category });
      } else {
        query.andWhere('categories.slug = :slug', { slug: category });
      }
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

    const brands = await query.getMany();

    return { brands: brands, pagination };
  }

  //get brand by brand id
  async getBrandById(id: string): Promise<BrandWithCategory> {
    const query = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.categories', 'categories');

    if (isUuidV4(id)) {
      query.where('brand.id=:id', { id });
    } else {
      query.where('brand.slug=:slug', { slug: id });
    }
    const brand = await query.getOne();

    if (!brand) throw new BadRequestException('Brand not found');

    brand.totalView++;
    await this.brandRepository.save(brand);
    return brand;
  }

  //   create a new brand
  async createBrand(createBrandDto: CreateBrandDto): Promise<BrandInterface> {
    const { brand, categories } = createBrandDto;
    await this.checkData.checkDuplicateName(
      this.brandRepository,
      'brand',
      brand,
    );
    //second parameter is field name in brand repository

    //check if all categories exists or not
    const categoryCheck = await this.checkData.checkCategory(categories);
    createBrandDto.categories = categoryCheck;
    const newbrand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(newbrand);
  }

  //update brand by brand id
  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandInterface> {
    const { brand, categories } = updateBrandDto;

    await this.checkData.checkDuplicateName(
      this.brandRepository,
      'brand',
      brand,
      id,
    );
    //check if all categories exist or not
    const category = await this.checkData.checkCategory(categories);
    updateBrandDto.id = id;
    updateBrandDto.categories = category;
    const updatedBrand = this.brandRepository.create(updateBrandDto);
    return await this.brandRepository.save(updatedBrand);
  }

  //to delete a brand by brand id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteBrand(id: string): Promise<any> {
    // Check if the brand with the given ID exists
    const brand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.vehicleDetails', 'vehicleDetails')
      .leftJoinAndSelect('brand.vehicleRequirements', 'vehicleRequirements')
      .leftJoinAndSelect('brand.models', 'models')
      .leftJoinAndSelect('brand.vehicles', 'vehicles')
      .where('brand.id=:id', { id })
      .getOne();

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }

    // Check if there are associated models or vehicles
    interface DataStructure {
      models?: Array<{ id: string; name: string }>;
      vehicles?: Array<{ id: string; name: string }>;
      vehicleDetails?: Array<{ id: string }>;
      vehicleRequirements?: Array<{ id: string }>;
    }
    const data: DataStructure = {};
    if (brand.models.length > 0) {
      const modelDependencies = brand.models.map((model) => ({
        id: model.id,
        name: model.model,
      }));
      data.models = modelDependencies;
    }

    if (brand.vehicles.length > 0) {
      const vehicleDependencies = brand.vehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
      }));
      data.vehicles = vehicleDependencies;
    }

    if (brand.vehicleDetails?.length > 0) {
      const detailDependencies = brand.vehicleDetails.map((d) => ({
        id: d.id,
      }));
      data.vehicleDetails = detailDependencies;
    }

    if (brand.vehicleRequirements?.length > 0) {
      const Dependencies = brand.vehicleRequirements.map((r) => ({ id: r.id }));
      data.vehicleRequirements = Dependencies;
    }

    if (Object.keys(data).length > 0) {
      return data;
    }

    // Delete the brand if no dependencies exist
    await this.brandRepository.remove(brand);
    return true;
  }

  async getBrandDetailBySlug(id: string, key: string): Promise<BrandInterface> {
    const query = this.brandRepository
      .createQueryBuilder('brand')
      .select([
        'brand.id',
        'brand.brand',
        'brand.slug',
        'brand.description',
        'brand.image',
        'brand.totalView',
      ]);

    if (isUuidV4(id)) {
      query.where('brand.id=:id', { id });
    } else {
      query.where('brand.slug=:slug', { slug: id });
    }
    const brand = await query.getOne();
    if (!brand) throw new BadRequestException('Brand not found');

    brand.totalView++;
    await this.brandRepository.save(brand);
    return brand;
  }

  //for homepage get brand by category slug
  async getBrandByCategory(
    category: string,
    key: string,
  ): Promise<BrandInterface[]> {
    const query = this.brandRepository.createQueryBuilder('brand');
    if (category)
      query.innerJoin(
        'brand.categories',
        'category',
        'category.slug = :category',
        { category },
      );

    query.select(['brand.id', 'brand.brand', 'brand.slug', 'brand.image']);
    const brand = await query.getMany();

    return brand;
  }

  //get all featured brands
  async getFeaturedBrands(key: string): Promise<Array<BrandInterface>> {
    const allFeaturedBrands = await this.brandRepository
      .createQueryBuilder('brand')
      .where('brand.featured = :featured', { featured: true })
      .addOrderBy('brand.position IS NULL', 'ASC')
      .addOrderBy('brand.position', 'ASC')
      .getMany();

    return allFeaturedBrands;
  }

  //update featured by brand id
  async updateFeaturedandPosition(
    id: string,
    updateFeaturedAndPOsition: UpdateFeaturedAndPosition,
  ): Promise<void> {
    const { position, featured } = updateFeaturedAndPOsition;
    const brand = await this.getBrandById(id);
    if (featured) {
      brand.featured = true;
      if (position !== null && position !== undefined) {
        if (brand.position !== position) {
          // Update positions for brands with the same featured status
          await this.checkData.updatePositionsForFeatured(
            this.brandRepository,
            position,
            brand.id,
          );
          brand.position = position;
        }
      } else if (position === null || position === undefined) {
        brand.position = null;
      }
    } else {
      brand.featured = false;
      brand.position = null;
    }
    await this.brandRepository.save(brand);
  }

  async mostPopularBrand(): Promise<BrandInterface[]> {
    const brands: Brand[] = await this.brandRepository
      .createQueryBuilder('brand')
      .orderBy('brand.totalView', 'DESC')
      .getMany();
    if (brands.length <= 0) throw new NotFoundException(`Brands not found.`);

    return brands;
  }
}
