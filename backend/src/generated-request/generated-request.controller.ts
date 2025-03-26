import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';

@Controller('generated-request')
export class GeneratedRequestController {
  constructor(private readonly generatedRequestService: GeneratedRequestService) {}

  @Post()
  create(@Body() createGeneratedRequestDto: CreateGeneratedRequestDto) {
    return this.generatedRequestService.create(createGeneratedRequestDto);
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
  update(@Param('id') id: string, @Body() updateGeneratedRequestDto: UpdateGeneratedRequestDto) {
    return this.generatedRequestService.update(+id, updateGeneratedRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generatedRequestService.remove(+id);
  }
}
