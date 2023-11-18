import { Entity } from '../entity';

export interface AggregateStore<T extends Entity> {
  store(aggregate: T): Promise<void>;
  load(id: string): Promise<T>;
}
