import { Booking } from '../domain/booking.entity';
import { MemoryAggregateStore } from './memory.aggregate-store';

export class BookingRepository extends MemoryAggregateStore(Booking) {}
