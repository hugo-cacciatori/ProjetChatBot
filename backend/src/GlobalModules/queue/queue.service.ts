import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GeneratedRequestService } from '../../generated-request/generated-request.service';
import { QueueJob } from '../../generated-request/utils';
import { v4 as uuidv4 } from 'uuid';
import { CustomLogger } from 'src/utils/Logger/CustomLogger.service';

@Injectable()
export class QueueService implements OnModuleInit {
  private jobQueue: QueueJob[] = [];
  private jobNotifier: () => void = () => {};
  private jobNotifierPromise: Promise<void> = Promise.resolve();
  private isRunning = false;
  private readonly logger = new CustomLogger();

  constructor(
    @Inject(forwardRef(() => GeneratedRequestService))
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}

  onModuleInit() {
    this.startProcessorLoop();
  }

  enqueue<T = any>(type: string, data: T): QueueJob {
    const job: QueueJob<T> = {
      id: uuidv4(),
      type,
      data,
      createdAt: new Date(),
    };
    this.jobQueue.push(job);

    this.logger.verbose(
      `Enqueued job of type ${type} with ID ${job.id} at ${job.createdAt.toISOString()}`,
    );
    // Notify processor that a new job is available
    this.jobNotifier();
    return job;
  }

  private async startProcessorLoop() {
    while (true) {
      if (!this.jobQueue.length) {
        this.jobNotifierPromise = new Promise<void>((res) => {
          this.jobNotifier = res;
        });
        await this.jobNotifierPromise;
      }

      const job = this.jobQueue.shift();
      if (!job) continue;

      try {
        switch (job.type) {
          case 'generatedRequest':
            await this.generatedRequestService.processNextRequest(job.data);
            this.logger.log(
              `Processed job of type ${job.type} with ID ${job.id}`,
            );
            break;
          default:
            this.logger.warn(
              `Unknown job type: ${job.type} for job ID ${job.id}`,
            );
        }
      } catch (err) {
        this.logger.error(
          `Error processing job of type ${job.type} with ID ${job.id}: ${err.message}`,
          'QueueService',
        );
      }
    }
  }
}
