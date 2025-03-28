import { CreateGeneratedRequestDto } from '../dto/create-generated-request.dto';
import { QueueService } from '../../GlobalModules/queue/queue.service';
import { GeneratedRequestService } from '../generated-request.service';
import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';

export class GeneratedRequestBuilder {
  private dto: CreateGeneratedRequestDto;
  private row: any;
  private queueService: QueueService;
  private generatedRequestService: GeneratedRequestService;

  constructor(
    queueService: QueueService,
    generatedRequestService: GeneratedRequestService,
  ) {
    this.queueService = queueService;
    this.generatedRequestService = generatedRequestService;
  }

  withDto(dto: CreateGeneratedRequestDto): this {
    this.dto = dto;
    return this;
  }

  withRow(row: any): this {
    this.row = row;
    return this;
  }

  async buildAndQueue(): Promise<number> {
    const requestContent = this.dto ? this.dto : this.row;
    const generatedRequest = await this.generatedRequestService.generateRequest(
      {
        status: GeneratedRequestStatus.PENDING,
        ...requestContent,
      },
    );

    this.queueService.enqueue('generatedRequest', {
      row: this.row,
      dto: this.dto,
      generatedRequestId: generatedRequest.id,
    });
    return generatedRequest.id;
  }
}
