import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGeneratedRequestDto } from './dto/create-generated-request.dto';
import { UpdateGeneratedRequestDto } from './dto/update-generated-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneratedRequest } from './entities/generated-request.entity';
import { Repository } from 'typeorm';
import { GeneratedRequestStatus } from '../utils/enum/generatedRequestStatus.enum';
import { LlmService } from '../llm/llm.service';
import * as XLSX from 'xlsx';
import { QueueService } from '../GlobalModules/queue/queue.service';
import { GeneratedRequestBuilder } from './builders/generatedRequest.builder';

@Injectable()
export class GeneratedRequestService {
  constructor(
    @InjectRepository(GeneratedRequest)
    private readonly generatedRequestRepository: Repository<GeneratedRequest>,
    private readonly llmService: LlmService,
    private readonly queueService: QueueService,
  ) {}

  async fileParser(fileBuffer: Buffer, dto: CreateGeneratedRequestDto) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer', WTF: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      const ids = [];

      for (const row of rows) {
        const builder = new GeneratedRequestBuilder(this.queueService, this);
        const id = await builder.withDto(dto).withRow(row).buildAndQueue();
        ids.push(id);
      }
      return { message: `${ids.length} items enqueued.`, ids };
    } catch (error) {
      console.error('Excel processing error:', error);
      throw new InternalServerErrorException(
        'an error occurred while created request',
        error,
      );
    }
  }

  async processNextRequest(data: {
    dto: CreateGeneratedRequestDto;
    row: any;
    generatedRequestId: number;
  }) {
    const { dto, row, generatedRequestId } = data;

    try {
      const generatedRequest = await this.update(generatedRequestId, {
        status: GeneratedRequestStatus.IN_PROGRESS,
        ...dto,
      });
      const llmResult = await this.llmService.request(row);

      await this.generatedRequestRepository.update(generatedRequest[0].id, {
        status: GeneratedRequestStatus.DONE,
      });
      return { id: generatedRequest[0].id, llmResult };
    } catch (error) {
      console.error('Failed to process job:', error);
    }
  }

  async generateRequest(createGeneratedRequestDto: CreateGeneratedRequestDto) {
    try {
      const generatedRequest = this.generatedRequestRepository.create(
        createGeneratedRequestDto,
      );
      return await this.generatedRequestRepository.save(generatedRequest);
    } catch (error) {
      console.error('Excel generating request:', error);
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
      console.error('error finding file:', error);
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
      await this.generatedRequestRepository.update(
        generatedRequestId,
        updateGeneratedRequestDto,
      );
      return this.generatedRequestRepository.find({
        where: { id: generatedRequestId },
      });
    } catch (error) {
      console.error('Excel updating error:', error);
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
      console.error('Excel removing error:', error);
      throw new InternalServerErrorException(
        `an error occurred while deleting request with id ${generatedRequestId}`,
        error,
      );
    }
  }
}
