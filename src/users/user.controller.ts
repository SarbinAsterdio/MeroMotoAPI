import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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
import { AuthenticatedRequest } from 'src/utils/interfaces';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { AllUsers, User, UserWithRole } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('admin-jwt'))
  async getUsers(
    @Query()
    { page, limit, search }: { page: number; limit: number; search: string },
  ): Promise<CommonResponse<AllUsers>> {
    const users = await this.userService.getUsers(
      page || 1,
      limit || 50,
      search,
    );
    return new CommonResponse<AllUsers>(
      HttpStatus.OK,
      'User find successfully',
      users,
    );
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async createUsers(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponse<User>> {
    const findUser = await this.userService.getUser(createUserDto.phoneNumber);
    if (findUser) throw new BadRequestException('User already exits!');
    const users = await this.userService.createUser(createUserDto);
    return new CommonResponse<User>(
      HttpStatus.CREATED,
      'User Created successfully',
      users,
    );
  }

  @Get('/details')
  @UseGuards(AuthGuard('user-jwt'))
  async getUserDetails(
    @Req() request: AuthenticatedRequest,
  ): Promise<CommonResponse<User>> {
    const user = await this.userService.getUser(request.user.phoneNumber);
    return new CommonResponse<User>(
      HttpStatus.OK,
      'User find successfully',
      user,
    );
  }

  @Get('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async getOneUser(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<UserWithRole>> {
    const user = await this.userService.getUserById(param.id);
    if (!user) throw new NotFoundException('User not found!');
    return new CommonResponse<UserWithRole>(
      HttpStatus.OK,
      'User find successfully',
      user,
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard('user-jwt'))
  async updateUser(
    @Param() param: ValidateUUIDDto,
    @Body() userDto: UpdateUserDto,
  ): Promise<CommonResponse<User>> {
    const user = await this.userService.getUserById(param.id);
    if (!user) throw new NotFoundException('User not found!');
    userDto.id = param.id;
    const updateUser = await this.userService.updateUser(userDto);
    return new CommonResponse<User>(
      HttpStatus.OK,
      'User updated successfully',
      updateUser,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteUser(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const user = await this.userService.getUserById(param.id);
    if (!user) throw new NotFoundException('User not found!');
    await this.userService.deleteUser(param.id);
    return new CommonResponse(HttpStatus.OK, 'User deleted successfully');
  }
  @Get('verifyVendor/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async verifyVendor(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<UserWithRole>> {
    const user = await this.userService.verifyVendor(param.id);
    if (!user) throw new NotFoundException('User not found!');
    return new CommonResponse<UserWithRole>(
      HttpStatus.OK,
      'User verify as vendor successfully',
      user,
    );
  }
}
