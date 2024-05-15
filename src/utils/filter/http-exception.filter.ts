import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };
    if (status === 400 && exception instanceof HttpException) {
      const validationErrors: any =
        exception.getResponse() as ValidationError[];
      errorResponse.message = validationErrors?.message;
      new BadRequestException(validationErrors?.message);
    }

    response.status(status).json(errorResponse);
  }
}
