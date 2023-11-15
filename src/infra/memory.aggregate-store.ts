import { Class } from '../common/class.type';
import { AggregateStore } from '../domain/aggregate-store.interface';
import { Change } from '../domain/change.interface';
import { Entity } from '../domain/entity';

export function MemoryAggregateStore<T extends Entity>(Entity: Class<T>) {
  return class EntityAggregateStore implements AggregateStore<T> {
    private readonly events: Map<string, ReadonlyArray<Change>> = new Map();

    async store(aggregate: Entity): Promise<void> {
      this.events.set(aggregate.id, aggregate.changes);
    }
    async load(id: string): Promise<T> {
      const bookingStream = this.events.get(id);
      if (!bookingStream) {
        throw new Error(`Aggregate with id ${id} not found`);
      }

      const entity = new Entity(id);
      bookingStream.forEach((change) => entity.when(change));
      return entity;
    }
  };
}
