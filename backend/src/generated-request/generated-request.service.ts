import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneratedRequest } from './entities/generated-request.entity';
import { Repository } from 'typeorm';
import { GeneratedRequestStatus } from '../utils/enum/generatedRequestStatus.enum';
import { LlmService } from '../llm/llm.service';
import * as XLSX from 'xlsx';

@Injectable()
export class GeneratedRequestService {
  constructor(
    @InjectRepository(GeneratedRequest)
    private readonly generatedRequestRepository: Repository<GeneratedRequest>,
    private readonly llmService: LlmService,
  ) {}

  async fileParser(fileBuffer: Buffer, dto: CreateGeneratedRequestDto) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      const results = [];

      for (const row of rows) {
        const generatedRequest = await this.generateRequest({
          status: GeneratedRequestStatus.PENDING,
          ...dto,
        });

        const llmResult = await this.llmService.request(row);
        results.push({ id: generatedRequest.id, llmResult });
      }
      return results;
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while created request',
        error,
      );
    }
  }

  async generateRequest(createGeneratedRequestDto: CreateGeneratedRequestDto) {
    try {
      const generatedRequest = this.generatedRequestRepository.create(
        createGeneratedRequestDto,
      );
      return await this.generatedRequestRepository.save(generatedRequest);
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while generateRequest',
        error,
      );
    }
  }

  async findOne(generatedRequestId: number) {
    try {
      return await this.generatedRequestRepository.findOneBy({
        id: generatedRequestId,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while finding request with id ${generatedRequestId}`,
        error,
      );
    }
  }

  async update(
    generatedRequestId: number,
    updateGeneratedRequestDto: UpdateGeneratedRequestDto,
  ) {
    try {
      return await this.generatedRequestRepository.update(
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

  async remove(generatedRequestId: number) {
    try {
      return await this.generatedRequestRepository.delete(generatedRequestId);
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while deleting request with id ${generatedRequestId}`,
        error,
      );
    }
  }
}
