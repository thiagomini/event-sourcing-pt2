import { Class } from '../common/class.type';
import { BookingStatus } from './booking.status';
import { Change } from './change.interface';

export class BookingCreated implements Change {
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
}

export class BookingPaid implements Change {
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
}

export function isEventOfType<T extends Change>(type: Class<T>) {
  return function (change: Change): change is T {
    return change instanceof type;
  };
}

export function asEvent<T extends Change>(change: Change): T {
  return change as T;
}
