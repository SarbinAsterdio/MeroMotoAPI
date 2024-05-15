import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckData, applyPagination } from 'src/utils/common';
import { Colors } from 'src/utils/entities';
import { updateSlug } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateColorDto, UpdateColorDto } from './color.dto';
import { AllColor, ColorInterface } from './color.interface';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Colors)
    private readonly colorRepository: Repository<Colors>,
    private readonly checkData: CheckData,
  ) {}

  async getAllColors(
    page: number,
    limit: number,
    search: string,
    all: boolean,
    key: string,
  ): Promise<AllColor> {
    const query = this.colorRepository
      .createQueryBuilder('color')
      .orderBy('color.createdAt', 'DESC');

    // Apply search filter if provided
    if (!all && search) {
      query.where(
        'LOWER(color.name) ILIKE :search OR LOWER(color.hexCode) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }

    // Get the total count of color
    const total = await query.getCount();

    //apply pagination
    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );
    const colors = await PaginatedQuery.getMany();
    return { colors, pagination };
  }

  async getColorById(id: string): Promise<ColorInterface> {
    const color = await this.colorRepository.findOneBy({ id });
    if (!color) throw new NotFoundException('Color not found');
    return color;
  }

  async createColor(createColorDto: CreateColorDto): Promise<ColorInterface> {
    createColorDto.name = createColorDto.name.toLocaleLowerCase();
    createColorDto.hexCode = createColorDto.hexCode.toLocaleLowerCase();

    await this.checkData.checkDuplicateName(
      this.colorRepository,
      'name',
      createColorDto.name,
    );
    await this.checkData.checkDuplicateName(
      this.colorRepository,
      'hexCode',
      createColorDto.hexCode,
    );

    const newColor = this.colorRepository.create(createColorDto);
    const color = await this.colorRepository.save(newColor);
    return color;
  }

  async updateColor(
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<ColorInterface> {
    updateColorDto.name = updateColorDto.name.toLocaleLowerCase();
    updateColorDto.hexCode = updateColorDto.hexCode.toLocaleLowerCase();

    await this.checkData.checkDuplicateName(
      this.colorRepository,
      'name',
      updateColorDto.name,
      id,
    );
    await this.checkData.checkDuplicateName(
      this.colorRepository,
      'hexCode',
      updateColorDto.hexCode,
      id,
    );

    updateColorDto.id = id;
    updateColorDto.slug = await updateSlug(updateColorDto.name);
    await this.colorRepository.save(updateColorDto);
    const color = await this.colorRepository.findOneBy({ id });
    return color;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteColor(id: string): Promise<any> {
    const color = await this.colorRepository
      .createQueryBuilder('color')
      .leftJoinAndSelect('color.availableColor', 'availableColors')
      .where('color.id= :id', { id })
      .getOne();
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found.`);
    }

    interface DataStructure {
      availableColors?: Array<{ id: string; name: string }>;
    }
    const data: DataStructure = {};

    if (color.availableColor?.length > 0) {
      data.availableColors = color.availableColor.map((avColor) => ({
        id: avColor.id,
        name: avColor.name,
      }));
    }

    if (Object.keys(data).length > 0) {
      return data;
    }
    await this.colorRepository.remove(color);
    return true;
  }
}
