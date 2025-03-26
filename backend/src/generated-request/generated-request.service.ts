import { Injectable } from '@nestjs/common';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';

@Injectable()
export class GeneratedRequestService {
  create(createGeneratedRequestDto: CreateGeneratedRequestDto) {
    return 'This action adds a new generatedRequest';
  }

  findAll() {
    return `This action returns all generatedRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generatedRequest`;
  }

  update(id: number, updateGeneratedRequestDto: UpdateGeneratedRequestDto) {
    return `This action updates a #${id} generatedRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} generatedRequest`;
  }
}
