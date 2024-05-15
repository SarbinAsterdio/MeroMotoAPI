import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import {
  CreateCallBackDto,
  UpdateRemarksCallBackDto,
  UpdateCallBackDto,
} from './callback.dto';
import {
  CallBacksWithPagination,
  CallBackInterface,
  CallBackPopulated,
} from './callback.interface';
import { CallBackService } from './callback.service';

@Controller('callback')
export class CallBackController {
  constructor(private readonly callBackService: CallBackService) {}

  //get all
  @Get()
  @UseGuards(AuthGuard('admin-jwt'))
  async getAll(
    @Query()
    {
      page,
      limit,
      search,
      all,
    }: { page: number; limit: number; search: string; all: boolean },
    @Req() request,
  ): Promise<CommonResponse<CallBacksWithPagination>> {
    const key = request?.originalUrl;
    const callbacks = await this.callBackService.getAll(
      page,
      limit,
      search,
      all,
      key,
    );
    return new CommonResponse<CallBacksWithPagination>(
      HttpStatus.OK,
      'All callback',
      callbacks,
    );
  }

  //add new
  @Post()
  async addNew(
    @Body(ValidationPipe) callbackDto: CreateCallBackDto,
  ): Promise<CommonResponse<CallBackInterface>> {
    const callback = await this.callBackService.createNew(callbackDto);
    return new CommonResponse<CallBackInterface>(
      HttpStatus.CREATED,
      'Created sucessfully.',
      callback,
    );
  }

  @Patch('update-remarks/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateRemarks(
    @Param() param: ValidateUUIDDto,
    @Body(ValidationPipe) callbackDto: UpdateRemarksCallBackDto,
  ): Promise<CommonResponse<CallBackPopulated>> {
    const callback = await this.callBackService.updateRemarksById(
      param?.id,
      callbackDto,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Callback remarks update successfully',
      callback,
    );
  }

  //edit
  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async update(
    @Param() param: ValidateUUIDDto,
    @Body() callbackDto: UpdateCallBackDto,
  ): Promise<CommonResponse<CallBackInterface>> {
    const callback = await this.callBackService.updateById(
      param?.id,
      callbackDto,
    );
    return new CommonResponse<CallBackInterface>(
      HttpStatus.OK,
      ' Updated successfully',
      callback,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async delete(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.callBackService.deleteById(param?.id);
    return new CommonResponse(HttpStatus.OK, ' Deleted successfully');
  }

  //get  by id
  @Get(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async getOne(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<CallBackInterface>> {
    const callback = await this.callBackService.getById(param?.id);
    return new CommonResponse<CallBackInterface>(
      HttpStatus.FOUND,
      'Callback found successfully',
      callback,
    );
  }

  @Get('update-verified/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateVerified(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.callBackService.verifyUpdate(param?.id);
    return new CommonResponse(
      HttpStatus.OK,
      'Callback verified update successfully',
    );
  }
}
