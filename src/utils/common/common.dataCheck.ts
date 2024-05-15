import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Colors } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorInterface } from '../interfaces';

type Entity = {
  id: string;
  position: number;
};
// category find and check
@Injectable()
export class CheckData {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Colors)
    private readonly colorRepository: Repository<Colors>,
  ) {}

  async checkCategory(categoryIds: Array<string>) {
    const categoryFind = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id IN (:...id)', { id: categoryIds })
      .getMany();

    const categoryCheck = categoryIds.filter(
      (id) => !categoryFind.some((data) => data.id === id),
    );
    if (categoryCheck.length > 0)
      throw new BadRequestException(
        `Given ${categoryCheck?.[0]} category does not exits!`,
      );

    return categoryFind;
  }

  async checkColor(colorIds: Array<string>): Promise<Array<ColorInterface>> {
    const colorFind = await this.colorRepository
      .createQueryBuilder('color')
      .where('color.id IN (:...id)', { id: colorIds })
      .getMany();

    const colorCheck = colorIds.filter(
      (id) => !colorFind.some((data) => data.id === id),
    );
    if (colorCheck.length > 0)
      throw new BadRequestException(
        `Given ${colorCheck?.[0]} color does not exits!`,
      );

    return colorFind;
  }

  //to check for duplicate name in database
  async checkDuplicateName<T>(
    repository: Repository<T>,
    field: string,
    name: string,
    id: string = null,
  ): Promise<void> {
    //field is name given to a field in repository whose name is to be checked
    //check if the name already exists
    const query = repository
      .createQueryBuilder('entity')
      .where(`LOWER(entity.${field})=:name`, {
        name: name.toLocaleLowerCase(),
      });

    if (id !== null) {
      query.andWhere('NOT entity.id = :id', { id: id });
    }
    const checkName = await query.getOne();

    if (checkName)
      throw new BadRequestException(`Given ${name} name already exists!`);
  }

  async updatePositionsForFeatured<T extends Entity>(
    repository: Repository<T>,
    newPosition: number,
    currentId: string,
  ): Promise<void> {
    const allFeatured = await repository
      .createQueryBuilder('entity')
      .where('entity.featured= :featured', { featured: true })
      .getMany();
    // const allFeatured = await repository.find({ where: { featured: true } });

    allFeatured.forEach(async (item) => {
      if (item.id !== currentId) {
        if (item.position >= newPosition) {
          item.position++;
          await repository.save(item);
        }
      }
    });
  }
}
