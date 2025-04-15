import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { ProductService } from '../product/product.service';
import { TagService } from '../tag/tag.service';
import { CustomLogger } from '../utils/Logger/CustomLogger.service';

@Injectable()
export class GeneratedRequestService {
  logger = new CustomLogger();
  constructor(
    @InjectRepository(GeneratedRequest)
    private readonly generatedRequestRepository: Repository<GeneratedRequest>,
    private readonly llmService: LlmService,
    private readonly queueService: QueueService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly tagService: TagService,
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

      const listOfTags: number[] = [];
      for (const keyword of llmResult.keywords) {
        const tag = await this.tagService.create({
          name: keyword,
        });
        if (!tag || !tag.id) {
          this.logger.warn(
            `Tag creation returned null for keyword: ${keyword}`,
          );
          throw new InternalServerErrorException('Error creating tag', keyword);
        }
        listOfTags.push(tag.id);
      }
      await this.productService.create({
        name: llmResult.title,
        description: llmResult.description,
        requestId: data.generatedRequestId,
        tagIds: listOfTags,
      });
      await this.update(data.generatedRequestId, {
        status: GeneratedRequestStatus.DONE,
      });
      return { id: generatedRequest.id, llmResult };
    } catch (error) {
      this.logger.error('Failed to process job:', error);
      throw new InternalServerErrorException('error :', error);
    }
  }

  async generateRequest(createGeneratedRequestDto: CreateGeneratedRequestDto) {
    try {
      const generatedRequest = this.generatedRequestRepository.create(
        createGeneratedRequestDto,
      );
      return await this.generatedRequestRepository.save(generatedRequest);
    } catch (error) {
      this.logger.error('Excel generating request:', error);
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
      this.logger.error('error finding file:', error);
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

      return await this.generatedRequestRepository.findOneBy({
        id: generatedRequestId,
      });
    } catch (error) {
      this.logger.error('Excel updating error:', error);
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
      this.logger.error('Excel removing error:', error);
      throw new InternalServerErrorException(
        `an error occurred while deleting request with id ${generatedRequestId}`,
        error,
      );
    }
  }
}
