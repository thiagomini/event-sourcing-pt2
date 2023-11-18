import { EventStream } from '../domain/event-stream';
import { Change } from '../domain/interfaces/change.interface';
import { EventStore } from '../domain/interfaces/event-store.interface';

export class MemoryEventStore implements EventStore {
  private readonly eventStreams: Map<string, EventStream> = new Map();

  loadEventStream(id: string): Promise<EventStream>;
  loadEventStream(
    id: string,
    options: { skipEvents: number; maxCount: number },
  ): Promise<EventStream>;
  async loadEventStream(
    id: string,
    options?: {
      skipEvents: number;
      maxCount: number;
    },
  ): Promise<EventStream | undefined> {
    return this.eventStreams.get(id);
  }
  async appendToStream(
    id: string,
    expectedVersion: number,
    ...events: Change[]
  ): Promise<void> {
    const newEventStream = new EventStream(expectedVersion, events);
    this.eventStreams.set(id, newEventStream);
  }
}
