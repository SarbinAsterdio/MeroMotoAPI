import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import {
  ModelInterface,
  ALlModels,
  ModelPopulated,
  AvailableColorInterface,
} from 'src/utils/interfaces';
import { CreateModelDto, UpdateModelDto } from './model.dto';
import { ModelService } from './model.service';
import { AvailableColorService } from 'src/availableColors/availableColor.service';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly availableColorService: AvailableColorService,
  ) {}

  //to get all the models
  @Get()
  async getAllModels(
    @Query()
    {
      page,
      limit,
      category,
      brand,
      color,
      search,
      isElectric,
      year,
      all,
    }: {
      page: number;
      limit: number;
      category: string;
      brand: string;
      color: string;
      search: string;
      isElectric: boolean;
      year: number;
      all: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<ALlModels>> {
    const allModels = await this.modelService.getAllModels(
      page,
      limit,
      category,
      brand,
      color,
      year,
      isElectric,
      search,
      all,
    );
    return new CommonResponse<ALlModels>(
      HttpStatus.OK,
      'Models found successfully',
      allModels,
    );
  }

  @Get('/get-all-admin')
  async getAllModelsAdmin(
    @Query()
    {
      page,
      limit,
      category,
      brand,
      search,
      color,
      isElectric,
      year,
      all,
    }: {
      page: number;
      limit: number;
      category: string;
      brand: string;
      search: string;
      color: string;
      isElectric: boolean;
      year: number;
      all: boolean;
    },
  ): Promise<CommonResponse<ALlModels>> {
    const allModels = await this.modelService.getAllModelsAdmin(
      page,
      limit,
      category,
      brand,
      color,
      year,
      isElectric,
      search,
      all,
    );
    return new CommonResponse<ALlModels>(
      HttpStatus.OK,
      'Models found sucessfully',
      allModels,
    );
  }

  //to get single model by model id
  @Get(':id')
  async getModelById(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<ModelPopulated>> {
    const model = await this.modelService.getModelById(param?.id);
    return new CommonResponse<ModelPopulated>(
      HttpStatus.OK,
      'Model found successfully',
      model,
    );
  }
  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async addNewModel(
    @Body() createModelDto: CreateModelDto,
  ): Promise<CommonResponse<ModelInterface>> {
    const model = await this.modelService.createModel(createModelDto);
    return new CommonResponse<ModelInterface>(
      HttpStatus.CREATED,
      'Model created successfully',
      model,
    );
  }

  @Get('/available-color/:id')
  async getAvailableColorById(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<Array<AvailableColorInterface>>> {
    const availableColor = await this.availableColorService.getAvailableColor(
      param?.id,
    );
    return new CommonResponse<Array<AvailableColorInterface>>(
      HttpStatus.OK,
      'Available Colors found successfully',
      availableColor,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateModel(
    @Param()
    param: ValidateUUIDDto,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<CommonResponse<ModelInterface>> {
    await this.modelService.getModelById(param?.id);
    const model = await this.modelService.updateModel(
      param?.id,
      updateModelDto,
    );
    return new CommonResponse<ModelInterface>(
      HttpStatus.OK,
      'Model updated successfully',
      model,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteModel(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.modelService.deleteModel(param?.id);
    return new CommonResponse<string>(
      HttpStatus.OK,
      'Model deleted successfully',
    );
  }
}
