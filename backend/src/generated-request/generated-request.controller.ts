import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { Express } from 'express';
import { ExcelValidationInterceptor } from '../Interceptor/excel-validation.interceptor';
import { AuthGuard } from '../auth/auth.guard';
@Controller('generated-request')
export class GeneratedRequestController {
  constructor(
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'), new ExcelValidationInterceptor())
  async parseExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGeneratedRequestDto,
    @Req() request: any,
  ) {
    const requestUserId = request.user.sub;
    return await this.generatedRequestService.fileParser(file.buffer, {
      ...dto,
      userId: requestUserId,
    });
  }

  @UseGuards(AuthGuard)
  @Get(':generatedRequestId')
  async findOne(@Param('generatedRequestId') generatedRequestId: number) {
    return await this.generatedRequestService.findOne(generatedRequestId);
  }

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getAllRequestByUserId(@Param('userId') userId: number) {
    return await this.generatedRequestService.findAllRequestByUserId(userId);
  }
}
