import { Change } from '../../src/domain/interfaces/change.interface';

export class TestableEvent implements Change {
  constructor(public readonly occurredOn: Date) {}
}
