// favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';
import { CommonResponse } from 'src/utils/common';
import { CreateFavoriteDto, ValidateUUIDDto } from 'src/utils/dtos';
import { FavoriteInterface } from 'src/utils/interfaces';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoritesService: FavoriteService) {}

  @Post()
  @UseGuards(AuthGuard('user-jwt'))
  async create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() request) {
    const user = request.user;
    const userId = user ? user.id : '';
    if (user) {
      const favorite = await this.favoritesService.create(
        createFavoriteDto,
        userId,
      );
      return new CommonResponse(
        HttpStatus.CREATED,
        'Created Successfully!',
        favorite,
      );
    } else {
      return new CommonResponse(
        HttpStatus.BAD_REQUEST,
        'Please login in first.',
      );
    }
  }

  @Get()
  async findAll(
    @Query()
    {
      page,
      limit,
      search,
      all,
      isFavorite,
    }: {
      page: number;
      limit: number;
      search: string;
      all: boolean;
      isFavorite: boolean;
    },
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const allFav = await this.favoritesService.findAll(
      page,
      limit,
      search,
      all,
      isFavorite,
      key,
    );
    return new CommonResponse(HttpStatus.OK, "All Favorite's", allFav);
  }

  @Get(':id')
  async findOne(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string> | CommonResponse<FavoriteInterface>> {
    const favorite = await this.favoritesService.findOneFavorite(param.id);
    return new CommonResponse(
      HttpStatus.FOUND,
      'Favorite Found Successfully!',
      favorite,
    );
  }

  @Delete(':id')
  async remove(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const favoriteDeleted = await this.favoritesService.remove(param.id);
    if (favoriteDeleted)
      return new CommonResponse<string>(
        HttpStatus.OK,
        'Favorite Removed Successfully!',
      );
    else
      return new CommonResponse<string>(
        HttpStatus.NOT_FOUND,
        'Favorite Not Found!',
      );
  }
  @Get('update/:id')
  async update(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string> | CommonResponse<FavoriteInterface>> {
    const updatedFavorite = await this.favoritesService.update(param.id);
    if (updatedFavorite)
      return new CommonResponse(
        HttpStatus.OK,
        'Favorite Updated Successfully!',
        updatedFavorite,
      );
  }
}
