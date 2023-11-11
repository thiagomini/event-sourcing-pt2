import { BookingStatus } from './booking.status.js';

export type ScheduleCommand = {
  customerId: string;
  hotelId: string;
  from: Date;
  to: Date;
};

export class Booking {
  public readonly customerId: string;
  public readonly hotelId: string;
  public readonly bookingStatus: BookingStatus;

  public readonly from: Date;
  public readonly to: Date;

  private constructor(
    customerId: string,
    hotelId: string,
    from: Date,
    to: Date,
    bookingStatus: BookingStatus = BookingStatus.Booked,
  ) {
    this.customerId = customerId;
    this.hotelId = hotelId;
    this.from = from;
    this.to = to;
    this.bookingStatus = bookingStatus;
  }

  public static schedule({
    customerId,
    hotelId,
    from,
    to,
  }: ScheduleCommand): Booking {
    return new Booking(customerId, hotelId, from, to);
  }
}
