import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface QueueJob<T = any> {
  id: string;
  type: string;
  data: T;
  createdAt: Date;
}

@Injectable()
export class QueueService {
  private queue: QueueJob[] = [];

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

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  getAllJobs(): QueueJob[] {
    return [...this.queue];
  }
}
