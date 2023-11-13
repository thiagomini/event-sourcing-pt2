import { BookingStatus } from './booking.status';
import { Change } from './change.interface';

export const Events = {
  BookingCreated: class BookingCreated implements Change {
    constructor(props: {
      bookingId: string;
      customerId: string;
      hotelId: string;
      from: Date;
      to: Date;
    }) {
      Object.assign(this, props);
    }
    readonly bookingStatus = BookingStatus.Booked;
    readonly bookingId: string;
    readonly occurredOn: Date;
    readonly customerId: string;
    readonly hotelId: string;
    readonly from: Date;
    readonly to: Date;
  },

  BookingPaid: class BookingPaid implements Change {
    constructor(props: {
      bookingId: string;
      paymentDate: Date;
      occurredOn: Date;
    }) {
      Object.assign(this, props);
    }

    paymentDate: Date;
    bookingId: string;
    occurredOn: Date;
  },
};