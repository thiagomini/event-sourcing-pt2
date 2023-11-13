import { describe, test } from 'node:test';
import { Booking } from '../../src/domain/booking.entity';
import assert from 'node:assert';
import { MemoryAggregateStore } from '../../src/infra/memory-aggregate-store';

describe('MemoryAggregateStore', () => {
  test('saves an entity', async () => {
    // Arrange
    const memoryAggregateStore = new MemoryAggregateStore();
    const props = {
      customerId: 'customer-1',
      hotelId: 'hotel-1',
      from: new Date('2021-01-01'),
      to: new Date('2021-01-02'),
    };
    const aBooking = Booking.schedule(props);

    // Act
    await memoryAggregateStore.store(aBooking);

    // Assert
    const savedBooking = await memoryAggregateStore.load(aBooking.id);
    assert.equal(savedBooking.id, aBooking.id);
    assert.equal(savedBooking.customerId, aBooking.customerId);
    assert.equal(savedBooking.hotelId, aBooking.hotelId);
    assert.equal(savedBooking.from, aBooking.from);
    assert.equal(savedBooking.to, aBooking.to);
  });
});
