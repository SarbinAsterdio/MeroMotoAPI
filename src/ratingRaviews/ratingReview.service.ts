// ratings-reviews.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.interface';
import { applyPagination } from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import { RatingAndReview, Vehicle } from 'src/utils/entities';
import { VehicleService } from 'src/vehicles/vehicle.service';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './ratingReview.dto';
import {
  RatingWithUserAndVehicle,
  RatingInterface,
  AllRating,
} from './ratingReview.interface';

@Injectable()
export class RatingReviewService {
  constructor(
    @InjectRepository(RatingAndReview)
    private readonly ratingRepository: Repository<RatingAndReview>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly vehicleService: VehicleService,
  ) {}

  async addRatingAndReview(createRatingDto: CreateRatingDto, user: User) {
    const { vehicleId, rating, name, mobileNumber, reviewMessage } =
      createRatingDto;
    // Check if the product exists
    const vehicle = await this.vehicleService.getOneVehicle(vehicleId);
    // Check if a review from the same review for the same product already exists
    const existingReview = await this.ratingRepository
      .createQueryBuilder('review')
      .where(
        'review.vehicleId = :vehicleId AND review.mobileNumber = :mobileNumber',
        { vehicleId, mobileNumber },
      )
      .getOne();

    if (existingReview) {
      // If a review already exists, update it
      existingReview.rating = rating;
      existingReview.reviewMessage = reviewMessage;
      await this.ratingRepository.save(existingReview);
      return existingReview;
    }

    // Create a new review
    const newReview = this.ratingRepository.create({
      ...createRatingDto,
      user,
    });

    await this.ratingRepository.save(newReview);

    return newReview;
  }

  async getRatingById(id: string): Promise<RatingWithUserAndVehicle> {
    const review = await this.ratingRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'users')
      .leftJoinAndSelect('review.vehicleId', 'vehicleId')
      .where('review.id = :id', { id })
      .getOne();
    if (!review)
      throw new BadRequestException('Rating Review with given id not found');
    return review;
  }

  async removeRatingById(id: string): Promise<boolean> {
    const review = await this.ratingRepository.findOne({ where: { id } });
    if (review) {
      await this.ratingRepository.remove(review);
      return true;
    } else return false;
  }

  async updateReview(
    id: string,
    reviewMessage: string,
    verified: boolean,
    rating: number,
  ): Promise<RatingInterface> {
    const existingReview = await this.ratingRepository
      .createQueryBuilder('review')
      .where('review.id = :id', { id })
      .getOne();
    if (!existingReview) {
      throw new NotFoundException('Review not found!');
    }
    // Update the properties of the existing review
    existingReview.verified = verified;
    existingReview.reviewMessage = reviewMessage;
    existingReview.rating = rating;

    // Save the updated review
    const updatedReview = await this.ratingRepository.save(existingReview);

    return updatedReview;
  }

  async getAllReview(
    rating: number,
    verified: boolean,
    vehicleId: string,
    key: string,
  ): Promise<RatingInterface[]> {
    const query = this.ratingRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.vehicleId', 'vehicle')
      .leftJoinAndSelect('review.user', 'user');

    // Filter by rating
    if (rating) {
      query.andWhere('review.rating = :rating', { rating });
    }

    // Filter by verified status
    if (verified) {
      query.andWhere('review.verified = :verified', { verified });
    }

    // Filter by vehicle ID
    if (vehicleId) {
      if (isUuidV4(vehicleId)) {
        query.andWhere('vehicle.id = :vehicleId', { vehicleId });
      } else {
        query.andWhere('vehicle.slug = :slug', { slug: vehicleId });
      }
    }
    const reviews = await query.getMany();
    return reviews;
  }
  async getAllReviewAdmin(
    page: number,
    limit: number,
    rating: number,
    verified: boolean,
    vehicleId: string,
    all: boolean,
    search: string,
  ): Promise<AllRating> {
    const query = this.ratingRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.vehicleId', 'vehicle')
      .leftJoinAndSelect('review.user', 'user');

    // Filter by rating
    if (!all && rating) {
      query.andWhere('review.rating = :rating', { rating });
    }

    // Filter by verified status
    if (!all && verified) {
      query.andWhere('review.verified = :verified', { verified });
    }

    // Filter by vehicle ID
    if (!all && vehicleId) {
      if (isUuidV4(vehicleId)) {
        query.andWhere('vehicle.id = :vehicleId', { vehicleId });
      } else {
        query.andWhere('vehicle.slug = :slug', { slug: vehicleId });
      }
    }

    // Apply search filter
    if (!all && search) {
      query.andWhere(
        'LOWER(review.reviewMessage) ILIKE :search OR LOWER(review.name) ILIKE :search OR LOWER(review.mobileNumber) ILIKE :search OR LOWER(vehicle.name) ILIKE :search OR CAST(review.rating AS text) ILIKE :search',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );

    const reviews = await PaginatedQuery.getMany();
    return { reviews, pagination };
  }

  async getAverageRating(vehicleId: string, key: string) {
    const product = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Use SQL query to calculate the average rating
    const result = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.rating', 'ratingReview')
      .where('vehicle.id = :vehicleId', { vehicleId })
      .select('ROUND(AVG(ratingReview.rating),2)', 'averageRating')
      .getRawOne();
    return result || 0; // Return the average rating, or 0 if no reviews yet
  }

  async updateVerified(ratingId: string): Promise<RatingInterface | any> {
    const rating = await this.getRatingById(ratingId);
    if (!rating) throw new NotFoundException('rating not found!');
    if (rating.verified) rating.verified = false;
    else rating.verified = true;
    const updatedReview = await this.ratingRepository.save(rating);
    return updatedReview;
  }

  async getRatingByVehicleId(
    id: string,
  ): Promise<Array<RatingWithUserAndVehicle>> {
    const review = this.ratingRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'users')
      .leftJoinAndSelect('review.vehicleId', 'vehicleId');
    if (isUuidV4(id)) review.where('vehicleId.id = :id', { id });
    else review.where('vehicleId.slug = :slug', { slug: id });
    const result = await review.getMany();
    if (result.length < 0)
      throw new BadRequestException(
        'Rating Review with given vehicle id not found',
      );
    return result;
  }
}
