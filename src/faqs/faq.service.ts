import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brands/brand.service';
import { ModelService } from 'src/models/model.service';
import { applyPagination } from 'src/utils/common';
import { isUuidV4 } from 'src/utils/dtos';
import { Faq } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { CreateFaqDto, FaqEntryDto, UpdateFaqDto } from './faq.dto';
import {
  FaqInterface,
  AllFaq,
  getFaqByBrandOrModelInterface,
} from './faq.interface';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    private readonly brandService: BrandService,
    private readonly modelService: ModelService,
  ) {}

  async createFaq(createFaqDto: CreateFaqDto): Promise<FaqEntryDto[]> {
    const { brand, entries } = createFaqDto;
    const foundBrand = await this.brandService.getBrandById(brand);
    if (foundBrand) createFaqDto.brand = foundBrand;
    const faqEntries: Array<FaqInterface> = entries.map(
      (entry: FaqEntryDto) => {
        // const checkModel = await this.modelService.getModelById(entry.model);
        // if (entry.model !== checkModel.id) {
        //   throw new NotAcceptableException(`Model must be of the particular brand.`);
        // }
        const newFaqEntry = this.faqRepository.create({
          brand,
          model: entry?.model ? entry?.model : null,
          question: entry.question,
          answer: entry.answer,
        });
        return newFaqEntry;
      },
    );

    return this.faqRepository.save(faqEntries);
  }

  async deleteFaq(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (faq) {
      await this.faqRepository.remove(faq);
      return true;
    } else {
      return false;
    }
  }

  async getFaqById(id: string): Promise<FaqInterface> {
    const faq = await this.faqRepository
      .createQueryBuilder('faq')
      .leftJoinAndSelect('faq.brand', 'brand')
      .leftJoinAndSelect('brand.models', 'model')
      .where('faq.id = :id', { id })
      .getOne();
    if (!faq) throw new BadRequestException('FAQ with given id not found');
    return faq;
  }

  async getAllFaq(
    page: number,
    limit: number,
    search: string,
    featured: boolean,
    all: boolean,
    brand: string,
    key: string,
  ): Promise<AllFaq> {
    const query = this.faqRepository
      .createQueryBuilder('faq')
      .leftJoinAndSelect('faq.brand', 'brand')
      .leftJoinAndSelect('faq.model', 'model')
      .orderBy('faq.updatedAt', 'DESC');

    if (!all && search) {
      query.where(
        'LOWER(faq.question) ILIKE :search OR LOWER(faq.answer) ILIKE :search',
        {
          search: `%${search.toLocaleLowerCase()}%`,
        },
      );
    }
    if (!all && !search && featured) {
      query.andWhere('faq.featured = :featured', {
        featured,
      });
    }

    if (!all && !search && !featured && brand) {
      query.where('LOWER(faq.brand) ILIKE :brand', {
        brand: `%${brand.toLocaleLowerCase()}%`,
      });
    }

    const total = await query.getCount();

    const { pagination, query: PaginatedQuery } = await applyPagination(
      query,
      page,
      all ? total : limit,
      total,
    );
    const allFaq = await PaginatedQuery.getMany();
    return { faq: allFaq, pagination };
  }

  async updateFeatured(id: string): Promise<FaqInterface> {
    const faq = await this.getFaqById(id);
    if (!faq) throw new NotFoundException('FAQ not found!');
    if (faq.featured) faq.featured = false;
    else faq.featured = true;
    const updatedFeatured = await this.faqRepository.save({
      ...faq,
      featured: faq.featured,
    });
    return updatedFeatured;
  }

  async updateFaq(
    updateFaqDto: UpdateFaqDto,
    id: string,
  ): Promise<FaqInterface> {
    const faq = await this.getFaqById(id);
    if (!faq) throw new NotFoundException('FAQ not found!');
    const { model } = updateFaqDto;
    if (model) {
      const checkModel = await this.modelService.getModelById(model);
      if (model !== checkModel.id) {
        throw new NotAcceptableException(
          `Model must be of the particular brand.`,
        );
      }
      updateFaqDto.model = checkModel;
    }
    const faqObj = this.faqRepository.create({
      ...updateFaqDto,
      id,
    });
    const savedFaq = await this.faqRepository.save(faqObj);
    return savedFaq;
  }

  async getFaqByBrandOrModelId(
    brandId: string,
    modelId: string,
  ): Promise<Array<getFaqByBrandOrModelInterface>> {
    const faq = this.faqRepository
      .createQueryBuilder('faq')
      .leftJoinAndSelect('faq.brand', 'brand')
      .leftJoinAndSelect('faq.model', 'model')
      .select([
        'faq.id',
        'faq.featured',
        'faq.question',
        'faq.answer',
        'faq.createdAt',
        'faq.updatedAt',
        'brand.id',
        'brand.slug',
        'brand.brand',
        'model.id',
        'model.slug',
        'model.model',
      ]);

    if (brandId) {
      if (isUuidV4(brandId)) {
        faq.where('brand.id=:brand AND faq.featured=:featured', {
          brand: brandId,
          featured: true,
        });
      } else {
        faq.where('brand.slug = :slug', { slug: brandId });
      }
    }
    if (modelId) {
      if (isUuidV4(modelId)) {
        faq.where('model.id=:model AND faq.featured=:featured', {
          model: modelId,
          featured: true,
        });
      } else {
        faq.where('model.slug = :slug', { slug: modelId });
      }
    }
    const result = await faq.getMany();
    return result;
  }
}
