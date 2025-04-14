export type QueueJob<T = any> = {
  id: string;
  type: string;
  data: T;
  createdAt: Date;
};
