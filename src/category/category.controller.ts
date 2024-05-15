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
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { CommonResponse } from 'src/utils/common';
import { AllCategories, CategoryInterface } from './category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { ValidateUUIDDto } from 'src/utils/dtos';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //get all categories
  @Get()
  async getCategories(
    @Query()
    {
      page,
      limit,
      search,
      type,
      all,
    }: {
      page: number;
      limit: number;
      search: string;
      type: string;
      all: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<AllCategories>> {
    const key = request?.originalUrl;
    const categories = await this.categoryService.getAllCategory(
      page,
      limit,
      search,
      type,
      all,
      key,
    );
    return new CommonResponse<AllCategories>(
      HttpStatus.OK,
      'All categories',
      categories,
    );
  }

  //add a new category
  @Post()
  async addNewCategory(
    @Body(ValidationPipe) categoryDto: CreateCategoryDto,
  ): Promise<CommonResponse<CategoryInterface>> {
    const category = await this.categoryService.createNewCategory(categoryDto);
    return new CommonResponse<CategoryInterface>(
      HttpStatus.CREATED,
      'New category created sucessfully.',
      category,
    );
  }

  //edit category details
  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateCategory(
    @Param() param: ValidateUUIDDto,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<CommonResponse<CategoryInterface>> {
    const updateCategory = await this.categoryService.updateCategoryById(
      param?.id,
      categoryDto,
    );
    return new CommonResponse<CategoryInterface>(
      HttpStatus.OK,
      'Category updated successfully',
      updateCategory,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteCategory(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const category = await this.categoryService.deleteCategoryById(param?.id);
    if (category == true) {
      return new CommonResponse(HttpStatus.OK, 'Category deleted successfully');
    }
    return new CommonResponse(
      206,
      'Cannot delete category. Remove or change its dependencies to delete it',
      category,
    );
  }

  @Get('/homepage')
  async CategoryInHomePage(): Promise<CommonResponse<CategoryInterface[]>> {
    const category = await this.categoryService.getCategoryForHomePage();
    return new CommonResponse(HttpStatus.OK, 'Categories found', category);
  }

  //get category by id
  @Get(':id')
  async getOneCategory(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<CategoryInterface>> {
    const category = await this.categoryService.getCategoryById(param?.id);
    return new CommonResponse<CategoryInterface>(
      HttpStatus.OK,
      'Category found successfully',
      category,
    );
  }

  @Get('featured-update/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async featuredUpdate(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.categoryService.featuredUpdate(param?.id);
    return new CommonResponse(
      HttpStatus.OK,
      'Category featured update successfully',
    );
  }

  @Get('searchable-update/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async searchableUpdate(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.categoryService.searchableUpdate(param?.id);
    return new CommonResponse(
      HttpStatus.OK,
      'Category searchable update successfully',
    );
  }
}
