import { BookingStatus } from './booking.status';
import { Change } from './change.interface';
import { Entity } from './entity';
import { Events } from './events';
import { randomUUID } from 'node:crypto';

export type ScheduleCommand = {
  customerId: string;
  hotelId: string;
  from: Date;
  to: Date;
};

export class Booking extends Entity {
  public readonly id: string;
  public readonly customerId: string;
  public readonly hotelId: string;
  public readonly bookingStatus: BookingStatus;
  public readonly paid: boolean;
  public readonly paymentDate: Date;

  public readonly from: Date;
  public readonly to: Date;

  protected when(change: Change): void {
    switch (change.constructor) {
      case Events.BookingCreated:
        const { occurredOn, ...props } = change;
        this.assign(props);
        break;

      case Events.BookingPaid:
        this.assign({
          paid: true,
          paymentDate: (change as unknown as { paymentDate: Date }).paymentDate,
        });
        break;
    }
  }

  public confirmPayment(paymentDate: Date): void {
    this.apply(
      new Events.BookingPaid({
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
    const booking = new Booking();
    booking.apply(
      new Events.BookingCreated({
        bookingId: bookingId,
        customerId,
        hotelId,
        from,
        to,
      }),
    );
    return booking;
  }
}
