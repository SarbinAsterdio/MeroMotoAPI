import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { CreateFaqDto, UpdateFaqDto } from './faq.dto';
import {
  AllFaq,
  FaqInterface,
  getFaqByBrandOrModelInterface,
} from './faq.interface';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async addFaq(@Body() createFaqDto: CreateFaqDto) {
    const faq = await this.faqService.createFaq(createFaqDto);
    return new CommonResponse(HttpStatus.CREATED, 'Created Successfully!', faq);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteFaq(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const faqDeleted = await this.faqService.deleteFaq(param?.id);
    if (faqDeleted)
      return new CommonResponse<string>(
        HttpStatus.OK,
        'FAQ deleted successfully',
      );
    else
      return new CommonResponse<string>(
        HttpStatus.BAD_REQUEST,
        'FAQ ID could not be found.',
      );
  }

  @Get()
  async getAllFaq(
    @Query()
    {
      page,
      limit,
      search,
      featured,
      all,
      brand,
    }: {
      page: number;
      limit: number;
      search: string;
      featured: boolean;
      all: boolean;
      brand: string;
    },
    @Req() request,
  ): Promise<CommonResponse<AllFaq>> {
    const key = request?.originalUrl;
    const faqs = await this.faqService.getAllFaq(
      page,
      limit,
      search,
      featured,
      all,
      brand,
      key,
    );
    return new CommonResponse<AllFaq>(HttpStatus.OK, "All FAQ's", faqs);
  }

  @Get('featured/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateFeatured(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<FaqInterface>> {
    const id = param?.id;
    await this.faqService.updateFeatured(id);
    return new CommonResponse<FaqInterface>(
      HttpStatus.OK,
      'Featured Updated Successfully.',
    );
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateFaq(
    @Param() param: ValidateUUIDDto,
    @Body() updateFaqDto: UpdateFaqDto,
  ): Promise<CommonResponse<FaqInterface>> {
    const id = param?.id;
    const updatedFaq = await this.faqService.updateFaq(updateFaqDto, id);
    return new CommonResponse<FaqInterface>(
      HttpStatus.OK,
      'FAQ Updated Successfully.',
      updatedFaq,
    );
  }

  //GET FAQ BY BRAND ID AND MODEL ID
  @Get('brand-model')
  async getFaqByBrandAndModel(
    @Query() { brandId, modelId }: { brandId: string; modelId: string },
  ) {
    const faq = await this.faqService.getFaqByBrandOrModelId(brandId, modelId);
    return new CommonResponse<Array<getFaqByBrandOrModelInterface>>(
      HttpStatus.OK,
      'FAQ Found Successfully.',
      faq,
    );
  }

  @Get(':id')
  async getFaqById(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string> | CommonResponse<FaqInterface>> {
    const faq = await this.faqService.getFaqById(param?.id);
    return new CommonResponse(HttpStatus.FOUND, 'FAQ Found Successfully', faq);
  }
}
