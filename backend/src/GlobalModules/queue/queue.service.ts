import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GeneratedRequestService } from '../../generated-request/generated-request.service';

interface QueueJob<T = any> {
  id: string;
  type: string;
  data: T;
  createdAt: Date;
}

@Injectable()
export class QueueService implements OnModuleInit {
  private queue: QueueJob[] = [];
  private isRunning = false;
  constructor(
    @Inject(forwardRef(() => GeneratedRequestService))
    private readonly generatedRequestService: GeneratedRequestService,
  ) {}
  onModuleInit() {
    this.startProcessorLoop();
  }
  private isProcessing = false;

  enqueue<T = any>(type: string, data: T): QueueJob {
    const job: QueueJob<T> = {
      id: uuidv4(),
      type,
      data,
      createdAt: new Date(),
    };
    this.queue.push(job);
    return job;
  }

  dequeue(): QueueJob | undefined {
    if (this.queue.length === 0) return undefined;

    let oldestIndex = 0;
    for (let i = 1; i < this.queue.length; i++) {
      if (
        this.queue[i].createdAt.getTime() <
        this.queue[oldestIndex].createdAt.getTime()
      ) {
        oldestIndex = i;
      }
    }

    const [oldestJob] = this.queue.splice(oldestIndex, 1);
    return oldestJob;
  }

  peek(): QueueJob | undefined {
    return this.queue[0];
  }

  getAllJobs(): QueueJob[] {
    return [...this.queue];
  }

  private async startProcessorLoop() {
    if (this.isRunning) return;

    this.isRunning = true;

    while (true) {
      if (this.isProcessing) {
        await this.sleep(100);
        continue;
      }

      const job = this.dequeue();
      if (!job) {
        await this.sleep(100);
        continue;
      }

      this.isProcessing = true;
      try {
        if (!job) {
          await this.sleep(100);
          continue;
        }
        this.isProcessing = true;

        switch (job.type) {
          case 'generatedRequest':
            await this.generatedRequestService.processNextRequest(job.data);
            break;

          default:
            console.warn(`Unknown job type: ${job.type}`);
        }
      } catch (err) {
        console.error('Error processing job', err);
      } finally {
        this.isProcessing = false;
      }

      await this.sleep(100);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
