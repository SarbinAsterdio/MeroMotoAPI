// favorites/favorites.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applyPagination } from 'src/utils/common';
import { Favorite, Users, Vehicle } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './favorite.dto';
import { FavoriteInterface, AllFav } from './favorite.interface';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(
    createFavoriteDto: CreateFavoriteDto,
    userId: string,
  ): Promise<FavoriteInterface> {
    const { vehicleId, isFavorite } = createFavoriteDto;

    // Check if the user and vehicle exist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!user || !vehicle) {
      throw new BadRequestException('User or Vehicle not found');
    }
    const favoriteExists = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, vehicle: { id: vehicleId } },
    });
    if (favoriteExists) {
      const deletedFavorite =
        await this.favoriteRepository.remove(favoriteExists);
      return deletedFavorite;
    }

    const favorite = new Favorite();
    favorite.user = user;
    favorite.vehicle = vehicle;
    favorite.isFavorite = isFavorite;

    return this.favoriteRepository.save(favorite);
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
    all: boolean,
    isFavorite: boolean,
    key: string,
  ): Promise<AllFav> {
    const query = this.favoriteRepository
      .createQueryBuilder('fav')
      .leftJoinAndSelect('fav.user', 'user')
      .leftJoinAndSelect('fav.vehicle', 'vehicle');

    if (!all && search) {
      query.where(
        'LOWER(user.name) ILIKE :search OR LOWER(vehicle.name) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }
    if (!all && !search && isFavorite) {
      query.andWhere('fav.isFavorite = :isFavorite', {
        isFavorite,
      });
    }
    const total = await query.getCount();

    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );
    const allFav = await PaginatedQuery.getMany();
    return { favorite: allFav, pagination };
  }

  async findOneFavorite(id: string): Promise<Favorite | undefined> {
    const result = this.favoriteRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });
    return result;
  }

  async remove(id: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.delete(id);
    if (favorite) return true;
    else return false;
  }

  async update(id: string): Promise<Favorite | undefined> {
    const favorite = await this.findOneFavorite(id);
    if (!favorite) throw new NotFoundException('Favorite Not Found!');
    if (favorite.isFavorite) favorite.isFavorite = false;
    else favorite.isFavorite = true;
    const updatedFavorite = await this.favoriteRepository.save({
      ...favorite,
      isFavorite: favorite.isFavorite,
    });
    return updatedFavorite;
  }
}
