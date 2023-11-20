import { EventStream } from '../event-stream';
import { Change } from './change.interface';

export interface EventStore {
  loadEventStream(id: string): Promise<EventStream | undefined>;
  loadEventStream(
    id: string,
    options: {
      skipEvents?: number;
      maxCount?: number;
    },
  ): Promise<EventStream | undefined>;
  appendToStream(
    id: string,
    expectedVersion: number,
    event: Change,
  ): Promise<void>;
}
