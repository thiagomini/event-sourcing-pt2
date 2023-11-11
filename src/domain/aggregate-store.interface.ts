export interface AggregateStore<T> {
  store(aggregate: T): Promise<void>;
  load(id: string): Promise<T>;
}
