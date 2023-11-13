import { AggregateStore } from '../domain/aggregate-store.interface';
import { Booking } from '../domain/booking.entity';
import { Change } from '../domain/change.interface';
import { Entity } from '../domain/entity';

export class MemoryAggregateStore implements AggregateStore<Booking> {
  private readonly events: Map<string, ReadonlyArray<Change>> = new Map();

  async store(aggregate: Booking): Promise<void> {
    this.events.set(aggregate.id, aggregate.changes);
  }
  async load(id: string): Promise<Booking> {
    const bookingStream = this.events.get(id);
    if (!bookingStream) {
      throw new Error(`Aggregate with id ${id} not found`);
    }

    const entity = new Booking(id);
    bookingStream.forEach((change) => entity.when(change));
    return entity;
  }
}
