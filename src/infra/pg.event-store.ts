import { EventStream } from '../domain/event-stream';
import { Change } from '../domain/interfaces/change.interface';
import { EventStore } from '../domain/interfaces/event-store.interface';
import pg from 'pg';

export class PgEventStore implements EventStore {
  constructor(private readonly pgClient: pg.Client) {}

  loadEventStream(id: string): Promise<EventStream | undefined>;
  loadEventStream(
    id: string,
    options: { skipEvents?: number | undefined; maxCount?: number | undefined },
  ): Promise<EventStream | undefined>;
  async loadEventStream(
    id: unknown,
    options?: unknown,
  ): Promise<EventStream | undefined> {
    const query = 'SELECT * FROM streams WHERE id = $1';
    const result = await this.pgClient.query<{
      version: number;
      event: Change;
      id: string;
    }>(query, [id]);

    const rows = result.rows;
    if (rows.length === 0) {
      return undefined;
    }
    const streamOfEvents: Change[] = [];
    for (const row of rows) {
      streamOfEvents.push({
        ...row.event,
        occurredOn: new Date(row.event.occurredOn),
      });
    }
    const lastVersion = rows[rows.length - 1].version;
    return new EventStream(lastVersion, streamOfEvents);
  }
  async appendToStream(
    id: string,
    expectedVersion: number,
    event: Change,
  ): Promise<void> {
    const queryForExistingStream = 'SELECT * FROM streams WHERE id = $1';
    const existingStream = await this.pgClient.query(queryForExistingStream, [
      id,
    ]);
    if (existingStream.rows.length > 0) {
      const stream = existingStream.rows[0];
      if (stream.version > expectedVersion) {
        throw new Error(
          `expected version ${expectedVersion} but latest was ${stream.version}`,
        );
      }
    }

    const query = 'INSERT INTO streams(id, version, event) VALUES($1, $2, $3)';
    await this.pgClient.query(query, [id, expectedVersion, event]);
  }
}
