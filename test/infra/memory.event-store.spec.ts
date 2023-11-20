import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Change } from '@/domain/interfaces/change.interface';
import { MemoryEventStore } from '@/infra/memory.event-store';

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
    assert.ok(eventStream);
    assert.equal(eventStream.length, 1);
    assert.equal(eventStream.eventAt(0), newEvent);
  });

  test('loads an event stream skipping an event', async () => {
    // Arrange
    const newEvent = new TestableEvent(new Date());
    const eventStore = new MemoryEventStore();
    const streamId = 'stream-id';

    // Act
    await eventStore.appendToStream(streamId, 0, newEvent);
    const eventStream = await eventStore.loadEventStream(streamId, {
      skipEvents: 1,
    });

    // Assert
    assert.ok(eventStream);
    assert.equal(eventStream.length, 0);
  });
});