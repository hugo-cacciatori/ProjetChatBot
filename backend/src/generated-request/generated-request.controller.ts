import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';

@Controller('generated-request')
export class GeneratedRequestController {
  constructor(
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}

  @Post()
  create(@UploadedFile() file) {
    return this.generatedRequestService.create(file);
  }

  @Get(':generatedRequestId')
  findOne(@Param('generatedRequestId') generatedRequestId: number) {
    return this.generatedRequestService.findOne(generatedRequestId);
  }

  @Patch(':generatedRequestId')
  update(
    @Param('generatedRequestId') generatedRequestId: number,
    @Body() updateGeneratedRequestDto: UpdateGeneratedRequestDto,
  ) {
    return this.generatedRequestService.update(
      generatedRequestId,
      updateGeneratedRequestDto,
    );
  }

  @Delete(':generatedRequestId')
  remove(@Param('generatedRequestId') generatedRequestId: number) {
    return this.generatedRequestService.remove(generatedRequestId);
  }
}
