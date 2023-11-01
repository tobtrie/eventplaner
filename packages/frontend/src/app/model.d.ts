export type Event = {
  id: string;
  title: string;
  city: string;
  date: string;
  tickets: Ticket[];
};

export type Ticket = {
  firstName: string;
  lastName: string;
  barcode: string;
};

export type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

export type ApiError = { message: string[]; error: string; statusCode: number };

export type CreateEventDto = Partial<Omit<Event, 'id' | 'tickets'>>;
export type CreateTicketDto = Omit<Ticket, 'barcode'>;
