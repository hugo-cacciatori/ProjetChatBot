import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { Express } from 'express';
@Controller('generated-request')
export class GeneratedRequestController {
  constructor(
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async parseExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGeneratedRequestDto,
  ) {
    return await this.generatedRequestService.fileParser(file.buffer, dto);
  }

  @Get(':generatedRequestId') async findOne(
    @Param('generatedRequestId') generatedRequestId: number,
  ) {
    return await this.generatedRequestService.findOne(generatedRequestId);
  }

  @Patch(':generatedRequestId') async update(
    @Param('generatedRequestId') generatedRequestId: number,
    @Body() updateGeneratedRequestDto: UpdateGeneratedRequestDto,
  ) {
    return await this.generatedRequestService.update(
      generatedRequestId,
      updateGeneratedRequestDto,
    );
  }

  @Delete(':generatedRequestId') async remove(
    @Param('generatedRequestId') generatedRequestId: number,
  ) {
    return await this.generatedRequestService.remove(generatedRequestId);
  }
}
