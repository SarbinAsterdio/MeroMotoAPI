// ratings-reviews.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import { CreateRatingDto, UpdateReviewDto } from './ratingReview.dto';
import { RatingInterface, AllRating } from './ratingReview.interface';
import { RatingReviewService } from './ratingReview.service';

@Controller('rating-review')
export class RatingReviewController {
  constructor(private readonly ratingsReviewsService: RatingReviewService) {}

  @Post()
  @UseGuards(AuthGuard('guest/user-jwt'))
  async createRatingReview(
    @Body() createRatingDto: CreateRatingDto,
    @Req() request,
  ) {
    const user = request?.user;
    const rating = await this.ratingsReviewsService.addRatingAndReview(
      createRatingDto,
      user,
    );
    return new CommonResponse(
      HttpStatus.CREATED,
      'Created Successfully!',
      rating,
    );
  }

  @Get()
  @UseGuards(AuthGuard('guest/admin-jwt'))
  async getAllReview(
    @Query()
    {
      rating,
      verified,
      vehicleId,
    }: {
      rating: number;
      verified: boolean;
      vehicleId: string;
    },
    @Req() request,
  ): Promise<CommonResponse<Array<RatingInterface>>> {
    const key = request?.originalUrl;
    const allReviews = await this.ratingsReviewsService.getAllReview(
      rating,
      verified,
      vehicleId,
      key,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Reviews found successfully',
      allReviews,
    );
  }

  @Get('/get-all-admin')
  @UseGuards(AuthGuard('guest/admin-jwt'))
  async getAllReviewAdmin(
    @Query()
    {
      page,
      limit,
      rating,
      verified,
      vehicleId,
      all,
      search,
    }: {
      page: number;
      limit: number;
      rating: number;
      reviewMessage: string;
      verified: boolean;
      vehicleId: string;
      all: boolean;
      search: string;
    },
    @Req() request,
  ): Promise<CommonResponse<AllRating>> {
    const allReviews = await this.ratingsReviewsService.getAllReviewAdmin(
      page,
      limit,
      rating,
      verified,
      vehicleId,
      all,
      search,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Reviews found successfully',
      allReviews,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteReview(@Param('id') id: string) {
    const reviewDeleted = await this.ratingsReviewsService.removeRatingById(id);
    if (reviewDeleted)
      return new CommonResponse<string>(
        HttpStatus.OK,
        'Review  Deleted Successfully.',
      );
    else
      return new CommonResponse<string>(
        HttpStatus.BAD_REQUEST,
        'Rating Review Could Not Be Found!',
      );
  }

  @Get(':vehicleId/average-rating')
  async getAverageRating(
    @Param('vehicleId') vehicleId: string,
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const averageRating = await this.ratingsReviewsService.getAverageRating(
      vehicleId,
      key,
    );
    return new CommonResponse(
      HttpStatus.FOUND,
      'Average Rating of Retrieved Successfully.',
      averageRating,
    );
  }

  @Get('vehicle-id/:id')
  async getRatingsReviewsByVehicleId(@Param('id') id: string) {
    const review = await this.ratingsReviewsService.getRatingByVehicleId(id);
    return new CommonResponse(
      HttpStatus.FOUND,
      'Review and Rating found successfully!',
      review,
    );
  }

  @Get(':id')
  async getProductRatingsReviews(@Param('id') id: string) {
    const review = await this.ratingsReviewsService.getRatingById(id);
    return new CommonResponse(
      HttpStatus.FOUND,
      'Review and Rating found successfully!',
      review,
    );
  }

  @Get('verified/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateVerified(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<RatingInterface>> {
    const id = param?.id;
    const updatedReview = await this.ratingsReviewsService.updateVerified(id);
    return new CommonResponse<RatingInterface>(
      HttpStatus.OK,
      'Review and Rating Updated Successfully.',
      updatedReview,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateReview(
    @Param() param: ValidateUUIDDto,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const { reviewMessage, verified, rating } = updateReviewDto;
    const updatedRating = await this.ratingsReviewsService.updateReview(
      param.id,
      reviewMessage,
      verified,
      rating,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Updated Successfully!',
      updatedRating,
    );
  }
}
