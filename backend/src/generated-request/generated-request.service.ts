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

  findOne(generatedRequestId: number) {
    try {
      return this.generatedRequestRepository.findOneBy({
        id: generatedRequestId,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while finding request with id ${generatedRequestId}`,
        error,
      );
    }
  }

  update(
    generatedRequestId: number,
    updateGeneratedRequestDto: UpdateGeneratedRequestDto,
  ) {
    try {
      return this.generatedRequestRepository.update(
        generatedRequestId,
        updateGeneratedRequestDto,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while updating request with id ${generatedRequestId}`,
        error,
      );
    }
  }

  remove(generatedRequestId: number) {
    try {
      return this.generatedRequestRepository.delete(generatedRequestId);
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while deleting request with id ${generatedRequestId}`,
        error,
      );
    }
  }
}
