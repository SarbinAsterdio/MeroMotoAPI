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
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import {
  CreateVehicleRequirementDto,
  UpdateVehicleRequirementDto,
} from './userRequirement.dto';
import {
  AllVehicleRequirements,
  VehicleRequirementPopulated,
} from './userRequirement.interface';
import { UserRequirementService } from './userRequirement.service';

@Controller('vehicle-requirement')
export class UserRequirementController {
  constructor(
    private readonly vehicleRequirementService: UserRequirementService,
  ) {}

  //get all vehicles  requirement
  @Get()
  async getAllVehicleRequirements(
    @Query()
    {
      page,
      limit,
      category,
      search,
      brand,
      model,
      description,
      transmission,
      name,
      email,
      phoneNumber,
      year,
      minBudget,
      maxBudget,
      all,
    }: {
      page: number;
      limit: number;
      category: string;
      search: string;
      brand: string;
      model: string;
      description: string;
      transmission: string;
      name: string;
      email: string;
      phoneNumber: number;
      year: number;
      minBudget: number;
      maxBudget: number;
      all: string;
    },
  ): Promise<CommonResponse<AllVehicleRequirements>> {
    const allRequirements = await this.vehicleRequirementService.findAll(
      page,
      limit,
      category,
      search,
      brand,
      model,
      description,
      transmission,
      name,
      email,
      phoneNumber,
      year,
      minBudget,
      maxBudget,
      all,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'All requirements',
      allRequirements,
    );
  }

  @Post()
  async addNewVehicleRequirement(
    @Body() createRequirementDto: CreateVehicleRequirementDto,
  ): Promise<CommonResponse<VehicleRequirementPopulated>> {
    const requirement =
      await this.vehicleRequirementService.addNewRequirement(
        createRequirementDto,
      );
    return new CommonResponse(
      HttpStatus.CREATED,
      'Created SuccessFully',
      requirement,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateVehicleRequirement(
    @Param() param: ValidateUUIDDto,
    @Body() updateRequirementDto: UpdateVehicleRequirementDto,
  ): Promise<CommonResponse<VehicleRequirementPopulated>> {
    await this.vehicleRequirementService.getOneById(param?.id);
    const requirement = await this.vehicleRequirementService.updateRequirement(
      param?.id,
      updateRequirementDto,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Updated SuccessFully',
      requirement,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async softDeleteVehicleRequirement(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.vehicleRequirementService.deleteRequirement(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Deleted SuccessFully');
  }

  //get one requirement
  @Get(':id')
  async getOneVehicleRequirement(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<VehicleRequirementPopulated>> {
    const requirement = await this.vehicleRequirementService.getOneById(
      param?.id,
    );
    return new CommonResponse(
      HttpStatus.FOUND,
      'Vehicle Requirement found',
      requirement,
    );
  }
}
