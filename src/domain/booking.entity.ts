import { match } from 'ts-pattern';
import { BookingStatus } from './booking.status';
import { Change } from './interfaces/change.interface';
import { Entity } from './entity';
import { BookingCreated, BookingPaid, isEventOfType } from './events';
import { randomUUID } from 'node:crypto';

export type ScheduleCommand = {
  customerId: string;
  hotelId: string;
  from: Date;
  to: Date;
};

export class Booking extends Entity {
  public readonly customerId: string;
  public readonly hotelId: string;
  public readonly bookingStatus: BookingStatus;
  public readonly paid: boolean;
  public readonly paymentDate: Date;

  public readonly from: Date;
  public readonly to: Date;

  constructor(bookingId: string) {
    super(bookingId);
  }

  public when(change: Change): void {
    match(change)
      .when(isEventOfType(BookingCreated), ({ occurredOn, ...props }) => {
        this.assign(props);
      })
      .when(isEventOfType(BookingPaid), ({ paymentDate }) => {
        this.assign({ paid: true, paymentDate });
      });
  }

  public confirmPayment(paymentDate: Date): void {
    this.apply(
      new BookingPaid({
        bookingId: this.id,
        paymentDate,
        occurredOn: new Date(),
      }),
    );
  }

  public static schedule({
    customerId,
    hotelId,
    from,
    to,
  }: ScheduleCommand): Booking {
    const bookingId = randomUUID();
    const booking = new Booking(bookingId);
    booking.apply(
      new BookingCreated({
        bookingId,
        customerId,
        hotelId,
        from,
        to,
      }),
    );
    return booking;
  }
}
