import { describe, test } from 'node:test';
import assert from 'node:assert';
import { MemoryEventStore } from '@/infra/memory.event-store';
import { TestableEvent } from './testable.event';



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

  test('throws an error when expected version is lower than latest', async () => {
    // Arrange
    const newEvent = new TestableEvent(new Date());
    const eventStore = new MemoryEventStore();
    const streamId = 'stream-id';
    await eventStore.appendToStream(streamId, 1, newEvent);

    // Act
    const promise = eventStore.appendToStream(streamId, 0, newEvent);

    // Assert
    await assert.rejects(
      async () => await promise,
      new Error('expected version 0 but latest was 1'),
    );
  });

  test('loads an event stream skipping many events', async () => {
    // Arrange
    const eventStore = new MemoryEventStore();
    const streamId = 'stream-id';
    const [firstEvent, secondEvent, thirdEvent] = [
      new TestableEvent(new Date()),
      new TestableEvent(new Date()),
      new TestableEvent(new Date()),
    ];

    await eventStore.appendToStream(streamId, 0, firstEvent);
    await eventStore.appendToStream(streamId, 1, secondEvent);
    await eventStore.appendToStream(streamId, 2, thirdEvent);

    // Act
    const eventStream = await eventStore.loadEventStream(streamId, {
      skipEvents: 2,
    });

    // Assert
    assert.ok(eventStream);
    assert.equal(eventStream.length, 1);
    assert.equal(eventStream.eventAt(0), thirdEvent);
  });

  test('loads an event stream skipping and limiting the events count', async () => {
    // Arrange
    const eventStore = new MemoryEventStore();
    const streamId = 'stream-id';
    const [firstEvent, secondEvent, thirdEvent, fourth] = [
      new TestableEvent(new Date()),
      new TestableEvent(new Date()),
      new TestableEvent(new Date()),
      new TestableEvent(new Date()),
    ];

    await eventStore.appendToStream(streamId, 0, firstEvent);
    await eventStore.appendToStream(streamId, 1, secondEvent);
    await eventStore.appendToStream(streamId, 2, thirdEvent);
    await eventStore.appendToStream(streamId, 3, fourth);

    // Act
    const eventStream = await eventStore.loadEventStream(streamId, {
      skipEvents: 1,
      maxCount: 2,
    });

    // Assert
    assert.ok(eventStream);
    assert.equal(eventStream.length, 2);
    assert.equal(eventStream.eventAt(0), secondEvent);
    assert.equal(eventStream.eventAt(1), thirdEvent);
  });
});
