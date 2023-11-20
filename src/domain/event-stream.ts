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

  public skipEvents(count?: number): EventStream {
    return new EventStream(this.version, this.events.slice(count));
  }

  public limitEvents(count?: number): EventStream {
    return new EventStream(this.version, this.events.slice(0, count));
  }

  public concat(newVersion: number, events: Change[]): EventStream {
    return new EventStream(newVersion, this.events.concat(events));
  }
}
