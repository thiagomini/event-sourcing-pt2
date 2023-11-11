import { describe, test } from 'node:test';
import assert from 'node:assert';
import { Booking } from '../../src/domain/booking.entity';
import { BookingStatus } from '../../src/domain/booking.status';

describe('Booking', () => {
  test('schedules a booking', () => {
    const booking = Booking.schedule({
      customerId: 'customer-id',
      hotelId: 'hotel-id',
      from: new Date('2020-01-01'),
      to: new Date('2020-01-02'),
    });

    assert.equal(booking.customerId, 'customer-id');
    assert.equal(booking.hotelId, 'hotel-id');
    assert.equal(booking.bookingStatus, BookingStatus.Booked);
  });
});
