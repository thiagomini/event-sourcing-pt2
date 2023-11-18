import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Change } from '../../src/domain/interfaces/change.interface';
import { MemoryEventStore } from '../../src/infra/memory.event-store';

class TestableEvent implements Change {
  constructor(public readonly occurredOn: Date) {}
}

describe('MemoryEventStore', () => {
  test('saves an event', async () => {
    // Arrange
    const newEvent = new TestableEvent(new Date());
    const eventStore = new MemoryEventStore();
    const streamId = 'stream-id';

    // Act
    await eventStore.appendToStream(streamId, 0, newEvent);

    // Assert
    const eventStream = await eventStore.loadEventStream(streamId);
    assert.equal(eventStream.length, 1);
    assert.equal(eventStream.eventAt(0), newEvent);
  });
});
