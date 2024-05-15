import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import { DeleteAvailableColorInterface } from './availableColor.interface';
import { AvailableColorService } from './availableColor.service';

@Controller('available-color')
export class AvailableColorController {
  constructor(private readonly availableColorService: AvailableColorService) {}

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async delete(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<DeleteAvailableColorInterface | boolean>> {
    const result = await this.availableColorService.deleteById(param?.id);
    if (result != null)
      return new CommonResponse(
        206,
        'Cannot delete body type. Remove or change its dependencies to delete it',
        result,
      );

    return new CommonResponse(HttpStatus.OK, 'Deleted SuccessFully');
  }
}
