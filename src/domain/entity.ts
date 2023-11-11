import { Change } from './change.interface';

export abstract class Entity {
  public readonly changes: Change[] = [];

  protected apply(change: Change): void {
    this.changes.push(change);
    this.when(change);
  }

  protected abstract when(change: Change): void;

  protected assign<T>(props: Partial<T>): void {
    Object.assign(this, props);
  }
}
