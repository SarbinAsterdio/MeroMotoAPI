import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { VehicleService } from './vehicle.service';
import {
  AllVehicles,
  HomePageElectric,
  HomePageVehicle,
  PopularUsedVehicles,
  VehicleImageInterface,
  VehicleInterface,
  VehiclePopulated,
  priceRange,
} from './vehicle.interface';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto, isUuidV4 } from 'src/utils/dtos';
import { BodyType } from 'src/utils/entities';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle.dto';
import { BodyTypeInterface } from 'src/bodyTypes/bodyType.interface';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  //get all vehicles
  @Get()
  async getAllVehicle(
    @Query()
    {
      page,
      limit,
      search,
      category,
      brand,
      model,
      bodyType,
      condition,
      type,
      approved,
      certified,
      upcoming,
      minPrice,
      maxPrice,
      all,
    }: {
      page: number;
      limit: number;
      search: string;
      category: string;
      brand: string;
      model: string;
      bodyType: string;
      condition: string;
      type: string;
      approved: boolean;
      certified: boolean;
      upcoming: boolean;
      minPrice: number;
      maxPrice: number;
      all: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<AllVehicles>> {
    // const key = request?.originalUrl;
    const allVehicles = await this.vehicleService.getAllVehicles(
      page,
      limit,
      search,
      category,
      brand,
      model,
      bodyType,
      condition,
      type,
      approved,
      certified,
      upcoming,
      minPrice,
      maxPrice,
      all,
    );
    return new CommonResponse(HttpStatus.OK, 'All vehicles', allVehicles);
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async addNewVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<CommonResponse<VehicleInterface>> {
    const vehicle = await this.vehicleService.addNewVehicle(createVehicleDto);
    return new CommonResponse(
      HttpStatus.CREATED,
      'Created SuccessFully',
      vehicle,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateVehicle(
    @Param() param: ValidateUUIDDto,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<CommonResponse<VehiclePopulated>> {
    await this.vehicleService.getOneVehicle(param?.id);
    const vehicle = await this.vehicleService.updateVehicleById(
      param?.id,
      updateVehicleDto,
    );
    return new CommonResponse(HttpStatus.OK, 'Updated SuccessFully', vehicle);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async softDeleteVehicle(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.vehicleService.deleteVehicle(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Deleted SuccessFully');
  }
  @Get('/price-range')
  async getPriceRanges(
    @Query() { category }: { category: string },
    @Req() request,
  ): Promise<CommonResponse<Array<priceRange>>> {
    const key = request?.originalUrl;
    const priceRanges = await this.vehicleService.getPriceRangeByCategory(
      category,
      key,
    );
    if (!priceRanges) throw new NotFoundException('No price ranges found ');
    return new CommonResponse(HttpStatus.OK, 'Success', priceRanges);
  }
  @Get('/year')
  async getYears(
    @Query()
    {
      category,
      brand,
      model,
    }: { category: string; brand: string; model: string },
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const allyears = await this.vehicleService.getVehicleYear(
      category,
      brand,
      model,
      key,
    );
    return new CommonResponse(HttpStatus.OK, 'All years', allyears);
  }

  @UseGuards(AuthGuard('guest/user-jwt'))
  @Get('/home-card-section')
  async getVehicles(
    @Query()
    {
      trending,
      approved,
      used,
      category,
      certified,
    }: {
      trending: boolean;
      approved: boolean;
      used: boolean;
      category: string;
      certified: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<Array<HomePageVehicle>>> {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    const vehicles = await this.vehicleService.forHomePage(
      trending,
      approved,
      used,
      category,
      certified,
      userId,
      key,
    );
    if (!vehicles) throw new NotFoundException('No vehicles found');
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicles found successfully',
      vehicles,
    );
  }
  @Get('/vehicle-listing')
  async vehicleListingPage(
    @Query()
    {
      condition,
      brand,
      model,
      minYear,
      maxYear,
      fuelType,
      bodyType,
      transmission,
      seats,
      colors,
      features,
      minPrice,
      maxPrice,
    }: {
      condition: string;
      brand: [string];
      model: [string];
      minYear: number;
      maxYear: number;
      fuelType: [string];
      bodyType: [BodyType];
      transmission: [string];
      seats: [number];
      colors: [string];
      features: [string];
      minPrice: [number];
      maxPrice: [number];
    },
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const vehicles = await this.vehicleService.filterListing(
      condition,
      brand,
      model,
      minYear,
      maxYear,
      fuelType,
      bodyType,
      transmission,
      seats,
      colors,
      features,
      minPrice,
      maxPrice,
      key,
    );
    return new CommonResponse(
      HttpStatus.FOUND,
      'Vehicles Found Successfully.',
      vehicles,
    );
  }
  @Get('/by-budget')
  @UseGuards(AuthGuard('guest/user-jwt'))
  async byBudget(
    @Query()
    {
      minPrice,
      maxPrice,
      category,
    }: { minPrice: number; maxPrice: number | string; category: string },
    @Req() request,
  ): Promise<CommonResponse<Array<HomePageVehicle>>> {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    const vehicles = await this.vehicleService.byBudget(
      minPrice,
      maxPrice,
      category,
      userId,
      key,
    );
    if (!vehicles) throw new NotFoundException('No vehicles found');
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicles found successfully',
      vehicles,
    );
  }
  @Get('/by-electric')
  @UseGuards(AuthGuard('guest/user-jwt'))
  async byElectric(
    @Query()
    { type, brandId }: { type: string; brandId: string },
    @Req() request,
  ): Promise<CommonResponse<Array<HomePageElectric>>> {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    const vehicles = await this.vehicleService.forElectricInHomePage(
      type,
      userId,
      brandId,
      key,
    );
    if (!vehicles) throw new NotFoundException('No vehicles found');
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicles found successfully',
      vehicles,
    );
  }
  @Get('/by-similar-body-type')
  @UseGuards(AuthGuard('guest/user-jwt'))
  async getSimilarBodyTypeByCategory(
    @Query()
    {
      category,
      bodyType,
      vehicle,
      brand,
    }: { category: string; bodyType: string; vehicle: string; brand: string },
    @Req() request,
  ): Promise<CommonResponse<Array<VehicleInterface>>> {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    const response = await this.vehicleService.getSimilarVehicleByCategory(
      category,
      bodyType,
      userId,
      vehicle,
      brand,
      key,
    );
    return new CommonResponse(HttpStatus.OK, 'Successful', response);
  }
  @Get('/by-body-type')
  @UseGuards(AuthGuard('guest/user-jwt'))
  async getALlBodyTypesByCategory(
    @Query()
    {
      category,
      bodyType,
      brandId,
    }: { category: string; bodyType: string; brandId: string },
    @Req() request,
  ): Promise<
    CommonResponse<{
      bodyTypes: BodyTypeInterface[];
      vehicles: VehicleInterface[];
    }>
  > {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    const response = await this.vehicleService.getBodyTypeByCategory(
      category,
      bodyType,
      userId,
      brandId,
      key,
    );
    return new CommonResponse(HttpStatus.OK, 'Successful', response);
  }
  @Get('/popular-used-vehicles')
  async getPopularUsedVehicles(
    @Query() { slugs }: { slugs: string },
    @Req() request,
  ): Promise<CommonResponse<PopularUsedVehicles>> {
    const key = request?.originalUrl;
    const response = await this.vehicleService.getPopularUsedVehicle(
      slugs,
      key,
    );
    return new CommonResponse(HttpStatus.OK, 'Successful', response);
  }

  @Get('/vehicle-detail-variant')
  async vehicleDetailPageByVariant(
    @Query()
    {
      slug,
      fuelType,
      transmission,
    }: { slug: string; fuelType: string; transmission: string },
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const vehicle = await this.vehicleService.getVehicleDetailVariant(
      slug,
      fuelType,
      transmission,
      key,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Variant Found Successfully',
      vehicle,
    );
  }

  //Get upcoming vehicles for brand
  @Get('/upcoming')
  @UseGuards(AuthGuard('guest/user-jwt'))
  async getUpComingVehicles(
    @Query()
    { category, brand }: { category: string; brand: string },
    @Req() request,
  ) {
    const userId = request?.user?.id;
    const key = request?.originalUrl;
    isUuidV4(category);
    isUuidV4(brand);
    const upcomingVehicles = await this.vehicleService.getUpcomingVehicle(
      category,
      brand,
      userId,
      key,
    );
    return new CommonResponse(HttpStatus.OK, 'Successful', upcomingVehicles);
  }

  //get one vehicle
  @Get(':id')
  async getOneVehicle(
    @Param() param: { id: string },
  ): Promise<CommonResponse<VehiclePopulated>> {
    const vehicle = await this.vehicleService.getOneVehicle(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Vehicle found', vehicle);
  }
  //approved update
  @Get('/update-approved/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateApproved(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<VehiclePopulated>> {
    await this.vehicleService.updateApproved(param?.id);
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicle approved updated successfully',
    );
  }

  @Get('/image-gallery/:id')
  async getAllImages(
    @Param() param: { id: string },
    @Req() request,
  ): Promise<CommonResponse<VehicleImageInterface>> {
    const key = request?.originalUrl;
    const images = await this.vehicleService.vehicleAllImages(param?.id, key);
    return new CommonResponse(HttpStatus.OK, 'All images', images);
  }
  //certified update
  @Get('/update-certified/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateCertified(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<VehiclePopulated>> {
    await this.vehicleService.updateCertified(param?.id);
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicle certified updated successfully',
    );
  }

  //upcoming update
  @Get('/update-upcoming/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateUpcoming(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<VehiclePopulated>> {
    await this.vehicleService.updateUpcoming(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Vehicle is online now');
  }

  @Get('/vehicle-detail/:id')
  async vehicleDetailPage(@Param() param: { id: string }, @Req() request) {
    const key = request?.originalUrl;
    const vehicle = await this.vehicleService.getVehicleDetail(param?.id, key);
    return new CommonResponse(
      HttpStatus.OK,
      'Vehicle Found Successfully',
      vehicle,
    );
  }
}
