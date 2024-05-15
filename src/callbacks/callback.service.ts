import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brands/brand.service';
import { applyPagination } from 'src/utils/common';
import {
  CreateCallBackDto,
  UpdateCallBackDto,
  UpdateRemarksCallBackDto,
} from 'src/utils/dtos';
import { CallBack } from 'src/utils/entities';
import {
  CallBacksWithPagination,
  CallBackPopulated,
  CallBackInterface,
} from 'src/utils/interfaces';
import { VehicleService } from 'src/vehicles/vehicle.service';

import { Repository } from 'typeorm';

@Injectable()
export class CallBackService {
  constructor(
    @InjectRepository(CallBack)
    private readonly callBackRepository: Repository<CallBack>,
    private readonly vehicleService: VehicleService,
    private readonly brandService: BrandService, // private readonly checkData: CheckData
  ) {}

  //get all
  async getAll(
    page: number,
    limit: number,
    search: string,
    all: boolean,
    key: string,
  ): Promise<CallBacksWithPagination> {
    //to find all from database
    const query = this.callBackRepository
      .createQueryBuilder('callback')
      .leftJoinAndSelect('callback.vehicle', 'vehicle')
      .orderBy('callback.createdAt', 'DESC');

    //for search
    if (!all && search) {
      query.where('LOWER(callback.name) ILIKE :search', {
        search: `%${search.toLocaleLowerCase()}%`,
      });
    }

    //get total count
    const total = await query.getCount();

    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );

    const callbacks = await PaginatedQuery.getMany();
    return { callbacks, pagination };
  }

  //to find  by  id
  async getById(id: string): Promise<CallBackPopulated> {
    const callback = this.callBackRepository
      .createQueryBuilder('callback')
      .leftJoinAndSelect('callback.vehicle', 'vehicle')
      .where('callback.id = :id', { id })
      .getOne();
    if (!callback) throw new BadRequestException('Callback not found');
    return callback;
  }

  //to add new
  async createNew(callbackDto: CreateCallBackDto): Promise<CallBackInterface> {
    const { vehicle, brand } = callbackDto;
    if (vehicle) {
      const checkVehicle = await this.vehicleService.getOneVehicle(vehicle);
      callbackDto.vehicle = checkVehicle;
    }
    if (brand) {
      const checkBrand = await this.brandService.getBrandById(brand);
      callbackDto.brand = checkBrand;
    }
    const callback = this.callBackRepository.create(callbackDto);
    return await this.callBackRepository.save(callback);
  }

  //update  by  id
  async updateById(
    id: string,
    callbackDto: UpdateCallBackDto,
  ): Promise<CallBackInterface> {
    const { vehicle, brand } = callbackDto;
    await this.getById(id);
    if (vehicle) {
      const checkVehicle = await this.vehicleService.getOneVehicle(
        callbackDto.vehicle,
      );
      callbackDto.vehicle = checkVehicle;
    }
    if (brand) {
      const checkBrand = await this.brandService.getBrandById(brand);
      callbackDto.brand = checkBrand;
    }
    callbackDto.id = id;
    const category = this.callBackRepository.create(callbackDto);
    const savedCategory = await this.callBackRepository.save(category);
    return savedCategory;
  }

  //update remarks
  async updateRemarksById(
    id: string,
    callbackDto: UpdateRemarksCallBackDto,
  ): Promise<CallBackPopulated> {
    const existingCallback = await this.getById(id);
    const newObj = {
      ...existingCallback,
      remarks: callbackDto.remarks,
    };
    const callback = await this.callBackRepository.save(newObj);
    return callback;
  }

  //to delete  by  id
  async deleteById(id: string): Promise<void> {
    await this.getById(id);
    await this.callBackRepository.delete(id);
  }

  //  verify update
  async verifyUpdate(id: string): Promise<void> {
    const callback = await this.getById(id);
    if (callback.verified) {
      throw new NotAcceptableException('Cannot undo verified');
    }
    callback.verified = true;
    await this.callBackRepository.save(callback);
  }
}
