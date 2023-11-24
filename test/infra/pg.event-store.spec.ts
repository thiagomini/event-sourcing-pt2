import { after, before, describe, test } from 'node:test';
import { TestableEvent } from './testable.event';
import assert from 'node:assert';
import pg from 'pg';
import { PgEventStore } from '../../src/infra/pg.event-store';
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
    const pgEventStore = new PgEventStore(pgClient);
    const newEvent = new TestableEvent(new Date());
    const streamId = 'stream-id';

    // Act
    await pgEventStore.appendToStream(streamId, 0, newEvent);

    // Assert
    const eventStream = await pgEventStore.loadEventStream(streamId);
    assert.ok(eventStream);
    assert.equal(eventStream.length, 1);
    assert.deepEqual(eventStream.eventAt(0).occurredOn, newEvent.occurredOn);
  });
});
