import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applyPagination, UserRole } from 'src/utils/common';
import { Users } from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import { Pagination, RoleInterface } from 'src/utils/interfaces';

import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private readonly userSelectFields = [
    'user.id',
    'user.name',
    'user.slug',
    'user.email',
    'user.phoneNumber',
    'user.image',
    'user.address',
    'user.role',
    'user.bio',
    'user.createdAt',
    'user.updatedAt',
  ];
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getUsers(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ users: User[]; pagination: Pagination }> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select([...this.userSelectFields])
      .orderBy('user.createdAt', 'DESC');

    // Apply search filter if provided
    if (search) {
      query.where(
        'user.slug ILIKE :search OR user.name ILIKE :search OR user.phoneNumber ILIKE :search OR user.email ILIKE :search OR user.address ILIKE :search OR user.role ILIKE :search',
        { search: `%${search}%` },
      );
    }
    // Get the total count of users
    const total = await query.getCount();

    //apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      limit,
      total,
    );

    const users = await PaginatedQuery.getMany();
    return { users, pagination };
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const createData = this.usersRepository.create(userDto);
    const user = await this.usersRepository.save(createData);
    delete user.password;
    delete user.loginOTP;
    delete user.updatedAt;
    return user;
  }

  async getUser(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([...this.userSelectFields])
      .where('user.phoneNumber = :phone', { phone: phoneNumber })
      .getOne();
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(this.userSelectFields)
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(userDto: UpdateUserDto): Promise<User> {
    userDto.slug = await updateSlug(userDto.name, true);
    await this.usersRepository.save(userDto);

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(this.userSelectFields)
      .where('user.id = :id', { id: userDto?.id })
      .getOne();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.usersRepository.delete(id);
    return true;
  }

  async verifyVendor(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(this.userSelectFields)
      .where('user.id = :id', { id: id })
      .getOne();

    if (!user) throw new NotFoundException('Category not found');

    user.role = user.role === UserRole.Vendor ? UserRole.User : UserRole.Vendor;
    await this.usersRepository.save(user);

    return user;
  }
}
