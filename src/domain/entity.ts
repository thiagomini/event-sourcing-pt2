import { Change } from './change.interface';

export abstract class Entity {
  public readonly changes: ReadonlyArray<Change> = [];
  public readonly version: number = -1;
  public readonly id: string;

  protected apply(change: Change): void {
    (this.changes as Change[]).push(change);
    this.when(change);
  }

  public abstract when(change: Change): void;

  protected assign<T>(props: Partial<T>): void {
    Object.assign(this, props);
  }
}
