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

  @Get()
  findAll() {
    return this.generatedRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generatedRequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGeneratedRequestDto: UpdateGeneratedRequestDto,
  ) {
    return this.generatedRequestService.update(+id, updateGeneratedRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generatedRequestService.remove(+id);
  }
}
