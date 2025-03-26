import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneratedRequest } from './entities/generated-request.entity';
import { Repository } from 'typeorm';
import { GeneratedRequestStatus } from '../utils/enum/generatedRequestStatus.enum';

@Injectable()
export class GeneratedRequestService {
  constructor(
    @InjectRepository(GeneratedRequest)
    private readonly generatedRequestRepository: Repository<GeneratedRequest>,
  ) {}
  create(createGeneratedRequestDto: CreateGeneratedRequestDto) {
    try {
      return this.generatedRequestRepository.create({
        status: GeneratedRequestStatus.PENDING,
        ...createGeneratedRequestDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while created request',
        error,
      );
    }
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
