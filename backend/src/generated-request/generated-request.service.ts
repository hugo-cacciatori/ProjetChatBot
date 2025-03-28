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

      for (const row of rows) {
        await this.generateRequest({
          status: GeneratedRequestStatus.PENDING,
          ...dto,
        });

        this.queueService.enqueue('generatedRequest', {
          row,
          dto,
        });
      }
      return { message: `${rows.length} items enqueued.` };
    } catch (error) {
      console.error('Excel processing error:', error);
      throw new InternalServerErrorException(
        'an error occurred while created request',
        error,
      );
    }
  }

  async processRequest() {
    const job = this.queueService.peek();
    if (!job) return;

    const { dto, row } = job.data;

    try {
      const generatedRequest = await this.generateRequest({
        status: GeneratedRequestStatus.PENDING,
        ...dto,
      });

      const llmResult = await this.llmService.request(row);

      this.queueService.dequeue();
      return { id: generatedRequest.id, llmResult };
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
      return await this.generatedRequestRepository.update(
        generatedRequestId,
        updateGeneratedRequestDto,
      );
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
