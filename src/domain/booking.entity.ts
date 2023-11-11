import { BookingStatus } from './booking.status.js';

export class Booking {
  public readonly customerId: string;
  public readonly hotelId: string;
  public readonly bookingStatus: BookingStatus;
}
