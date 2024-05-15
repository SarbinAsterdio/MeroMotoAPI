import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableColor } from 'src/utils/entities';
import { ModelInterface } from 'src/utils/interfaces';

import { Repository } from 'typeorm';
import {
  CreateAvailableColorDto,
  UpdateAvailableColorDto,
} from './availableColor.dto';
import { AvailableColorInterface } from './availableColor.interface';
import { ColorService } from 'src/colors/color.service';

@Injectable()
export class AvailableColorService {
  constructor(
    @InjectRepository(AvailableColor)
    private readonly availableColorRepository: Repository<AvailableColor>,
    private readonly colorService: ColorService,
  ) {}

  async getAvailableColor(id: string): Promise<Array<AvailableColorInterface>> {
    const avcolor = await this.availableColorRepository
      .createQueryBuilder('col')
      .leftJoinAndSelect('col.color', 'color')
      .where('col.model = :id', { id })
      .getMany();

    return avcolor;
  }

  async createAvailableColors(
    model: ModelInterface,
    availableColors: Array<CreateAvailableColorDto>,
  ) {
    if (availableColors && availableColors.length > 0) {
      const allColors = availableColors.map(
        async (ac: CreateAvailableColorDto) => {
          const color = await this.colorService.getColorById(ac.color);
          const newAvColor = this.availableColorRepository.create({
            ...ac,
            color,
            model,
          });
          return this.availableColorRepository.save(newAvColor);
        },
      );

      await Promise.all(allColors);
    }
  }

  async updateAvailableColors(
    model: ModelInterface,
    updatedColors: Array<UpdateAvailableColorDto>,
  ) {
    const existingColors = await this.availableColorRepository
      .createQueryBuilder('availableColor')
      .leftJoinAndSelect('availableColor.color', 'color')
      .where('availableColor.model = :model', { model: model.id })
      .getMany();
    // for (const updatedColor of updatedColors) {
    const update = updatedColors.map(async (updatedColor) => {
      const { image, name } = updatedColor;
      const color = await this.colorService.getColorById(updatedColor.color);
      if ('id' in updatedColor) {
        const existingColor = existingColors.find(
          (ac) => ac.id == updatedColor.id,
        );
        if (existingColor) {
          //update the availabel color
          const updateAvColor = this.availableColorRepository.create({
            ...updatedColor,
            color,
            model: model,
            id: existingColor.id,
          });
          return this.availableColorRepository.save(updateAvColor);
        }
      } else {
        //create
        const newAvColor = this.availableColorRepository.create({
          image,
          name,
          color,
          model: model,
        });
        return this.availableColorRepository.save(newAvColor);
      }
    });
    await Promise.all(update);

    const colorsToDelete = [];
    for (const existingColor of existingColors) {
      if (!updatedColors.some((uc) => uc.id === existingColor.id)) {
        // Color exists in the existing list but not in the updated list, mark it for deletion
        colorsToDelete.push(existingColor.id);
      }
    }
    if (colorsToDelete.length > 0) {
      //delete colors from db which are not in dto
      await this.availableColorRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(colorsToDelete)
        .execute();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteById(id: string): Promise<any> {
    const availableColor = await this.availableColorRepository
      .createQueryBuilder('color')
      .leftJoinAndSelect('color.vehicle', 'vehicle')
      .where('color.id = :id', { id })
      .select([
        'color.id',
        'color.name',
        'vehicle.id',
        'vehicle.name',
        'vehicle.slug',
      ])
      .getOne();
    interface DataStructure {
      vehicles?: Array<{ id: string; name: string }>;
    }
    const data: DataStructure = {};
    // if (brand.models.length > 0) {
    //   const modelDependencies = brand.models.map((model) => ({ id: model.id, name: model.model }));
    //   data.models = modelDependencies;
    // }
    if (availableColor) {
      if (availableColor.vehicle.length > 0) {
        //return dependency
        // availableColor.vehicle
        const dependencies = availableColor.vehicle.map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.name,
        }));
        data.vehicles = dependencies;
        return data;
      }
      await this.availableColorRepository.remove(availableColor);
      return null;
    }
    throw new NotFoundException('Cannot find available color ');
  }
}
