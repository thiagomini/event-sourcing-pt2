import { Change } from './interfaces/change.interface';

export class EventStream {
  private readonly events: Change[] = [];
  constructor(
    public readonly version: number,
    events: Change[],
  ) {
    this.events.push(...events);
  }

  public get length(): number {
    return this.events.length;
  }

  public eventAt(index: number): Change {
    return this.events[index];
  }
}
