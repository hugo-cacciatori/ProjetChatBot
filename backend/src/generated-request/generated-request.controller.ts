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
import { CustomLogger } from 'src/utils/Logger/CustomLogger.service';
@Controller('generated-request')
export class GeneratedRequestController {
  private readonly logger = new CustomLogger();
  constructor(
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async parseExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGeneratedRequestDto,
  ) {
    try {
      this.logger.log(
        'Parsing file for generated request: ' + file.originalname,
      );
      return await this.generatedRequestService.fileParser(file.buffer, dto);
    } catch (error) {
      this.logger.error('Error parsing file : ' + file.originalname, error);
      throw error;
    }
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
    try {
      this.logger.log(
        'Updating generated request with id: ' + generatedRequestId,
      );
      return await this.generatedRequestService.update(
        generatedRequestId,
        updateGeneratedRequestDto,
      );
    } catch (error) {
      this.logger.error(
        'Error updating generated request with id: ' + generatedRequestId,
        error,
      );
      throw error;
    }
  }

  @Delete(':generatedRequestId') async remove(
    @Param('generatedRequestId') generatedRequestId: number,
  ) {
    try {
      this.logger.log(
        'Removing generated request with id: ' + generatedRequestId,
      );
      return await this.generatedRequestService.remove(generatedRequestId);
    } catch (error) {
      this.logger.error(
        'Error removing generated request with id: ' + generatedRequestId,
        error,
      );
      throw error;
    }
  }
}
