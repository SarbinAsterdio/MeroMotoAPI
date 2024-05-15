import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { BrandService } from './brand.service';
import { CommonResponse } from 'src/utils/common';
import {
  CreateBrandDto,
  UpdateBrandDto,
  UpdateFeaturedAndPosition,
  ValidateUUIDDto,
} from 'src/utils/dtos';
import {
  AllBrands,
  BrandInterface,
  BrandWithCategory,
} from './brand.interface';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //to get all the brands
  @Get()
  async getAllBrands(
    @Query()
    {
      page,
      limit,
      category,
      search,
      all,
    }: {
      page: number;
      limit: number;
      category: string;
      search: string;
      all: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<AllBrands>> {
    const key = request?.originalUrl;
    const allbrands = await this.brandService.getAllBrands(
      page,
      limit,
      category,
      search,
      all,
      key,
    );
    return new CommonResponse<AllBrands>(
      HttpStatus.OK,
      'Brands found sucessfully',
      allbrands,
    );
  }

  @Get('/featured')
  async getFeaturedBrands(@Req() request) {
    const key = request?.originalUrl;
    const featuredBrands = await this.brandService.getFeaturedBrands(key);
    return new CommonResponse(HttpStatus.OK, 'Success', featuredBrands);
  }

  @Get('most-popular-brand')
  async getPopularBrand(): Promise<CommonResponse<BrandInterface[]>> {
    const brands = await this.brandService.mostPopularBrand();
    return new CommonResponse<BrandInterface[]>(
      HttpStatus.OK,
      'Most Popular Brands Found Successfully.',
      brands,
    );
  }

  @Get('detail/:id')
  async getBrandDetailBySlug(
    @Param() { id }: { id: string },
    @Req() request,
  ): Promise<CommonResponse<BrandInterface>> {
    const key = request?.originalUrl;
    const detail = await this.brandService.getBrandDetailBySlug(id, key);
    return new CommonResponse(HttpStatus.OK, 'Success', detail);
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async addNewBrand(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<CommonResponse<BrandInterface>> {
    const brand = await this.brandService.createBrand(createBrandDto);
    return new CommonResponse<BrandInterface>(
      HttpStatus.CREATED,
      'Brand created successfully',
      brand,
    );
  }

  // @Get('new-vehicle')
  // @UseGuards(AuthGuard('guest/user-jwt'))
  // async getVehicleBrand(
  //   @Query()
  //   { category, bodyType, brandId }: { category: string; bodyType: string; brandId: string },
  //   @Req() request
  // ) {
  //   const userId = request?.user?.id;
  //   const key = request?.originalUrl;
  //   const vehicleDetail = await this.vehicleService.getNewVehicleDetailPage(category, bodyType, userId, brandId, key);
  //   return new CommonResponse(HttpStatus.OK, 'Successful Retrieved Data.', vehicleDetail);
  // }

  // @Get('/used-vehicle')
  // @UseGuards(AuthGuard('guest/user-jwt'))
  // async getUsedVehicleBrand(
  //   @Query()
  //   { brandId ,category}: { brandId: string,category:string },
  //   @Req() request
  // ) {
  //   const key = request?.originalUrl;
  //   const usedVehicles = await this.vehicleService.getUsedVehicleDetailPage(brandId,category, key);
  //   return new CommonResponse(HttpStatus.OK, 'Successful Retrieved Data.', usedVehicles);
  // }

  // @Get('/electric')
  // @UseGuards(AuthGuard('guest/user-jwt'))
  // async getElectricBrandDetail(
  //   @Query()
  //   { type, brandId }: { type: string; brandId: string },
  //   @Req() request,
  // ) {
  //   const userId = request?.user?.id;
  //   const key = request?.originalUrl;
  //   const vehicleDetail = await this.vehicleService.forElectricInHomePage(
  //     type,
  //     userId,
  //     brandId,
  //     key,
  //   );
  //   return new CommonResponse(
  //     HttpStatus.OK,
  //     'Successful Retrieved Data.',
  //     vehicleDetail,
  //   );
  // }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateBrand(
    @Param()
    param: ValidateUUIDDto,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<CommonResponse<BrandInterface>> {
    const { id } = param;
    await this.brandService.getBrandById(id);
    const brand = await this.brandService.updateBrand(id, updateBrandDto);
    return new CommonResponse<BrandInterface>(
      HttpStatus.OK,
      'Brand updated successfully',
      brand,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteBrand(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const brand = await this.brandService.deleteBrand(param?.id);
    if (brand == true) {
      return new CommonResponse<string>(
        HttpStatus.OK,
        'Brand deleted successfully',
      );
    }
    return new CommonResponse<string>(
      206,
      'Cannot delete brand. Remove or change its dependencies to delete it',
      brand,
    );
  }

  @Put('/update-featured-and-position/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateFeatured(
    @Param() param: ValidateUUIDDto,
    @Body() update: UpdateFeaturedAndPosition,
  ): Promise<CommonResponse<string>> {
    await this.brandService.updateFeaturedandPosition(param?.id, update);
    return new CommonResponse(HttpStatus.OK, 'Updated successfully');
  }

  //to get single brand by brand id
  @Get(':id')
  async getBrandById(
    @Param() param: { id: string },
  ): Promise<CommonResponse<BrandWithCategory>> {
    const brand = await this.brandService.getBrandById(param?.id);
    return new CommonResponse<BrandWithCategory>(
      HttpStatus.OK,
      'Brand found successfully',
      brand,
    );
  }
}
