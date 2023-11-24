import { after, before, describe, test } from 'node:test';
import { TestableEvent } from './testable.event';
import assert from 'node:assert/strict';
import pg from 'pg';
import { PgEventStore } from '../../src/infra/pg.event-store';
import { randomUUID } from 'node:crypto';
const Client = pg.Client;

let pgClient: pg.Client;

describe('PgEventStore', () => {
  before(async () => {
    pgClient = new Client(
      'postgres://postgres:postgres@localhost:5433/postgres',
    );
    await pgClient.connect();
    await pgClient.query('DELETE FROM streams');
  });

  after(async () => {
    await pgClient.end();
  });

  test('saves an event', async () => {
    // Arrange
    const pgEventStore = createPgEventStore();
    const newEvent = new TestableEvent(new Date());
    const streamId = randomUUID();

    // Act
    await pgEventStore.appendToStream(streamId, 0, newEvent);

    // Assert
    const eventStream = await pgEventStore.loadEventStream(streamId);
    assert.ok(eventStream);
    assert.equal(eventStream.length, 1);
    assert.deepEqual(eventStream.eventAt(0).occurredOn, newEvent.occurredOn);
  });

  test('loads an event stream skipping an event', async () => {
    // Arrange
    const newEvent = new TestableEvent(new Date());
    const pgEventStore = createPgEventStore();
    const streamId = randomUUID();

    // Act
    await pgEventStore.appendToStream(streamId, 0, newEvent);
    const eventStream = await pgEventStore.loadEventStream(streamId, {
      skipEvents: 1,
    });

    // Assert
    assert.ok(eventStream);
    assert.equal(eventStream.length, 0);
  });

  test('throws an error when expected version is lower than latest', async () => {
    // Arrange
    const newEvent = new TestableEvent(new Date());
    const eventStore = createPgEventStore();
    const streamId = randomUUID();
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
    const eventStore = createPgEventStore();
    const streamId = randomUUID();
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
    assert.deepEqual(eventStream.eventAt(0).occurredOn, thirdEvent.occurredOn);
  });

  test('loads an event stream skipping and limiting the events count', async () => {
    // Arrange
    const eventStore = createPgEventStore();
    const streamId = randomUUID();
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
    assert.deepEqual(eventStream.eventAt(0).occurredOn, secondEvent.occurredOn);
    assert.deepEqual(eventStream.eventAt(1).occurredOn, thirdEvent.occurredOn);
  });
});

function createPgEventStore() {
  return new PgEventStore(pgClient);
}