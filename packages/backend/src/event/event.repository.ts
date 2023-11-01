import { Injectable } from '@nestjs/common';
import { Event, Ticket } from './event.dto';
import { exampleData } from './example.data';

@Injectable()
export class EventRepository {
  private events: Event[] = exampleData;

  /**
   * This mehtods returns all events
   * @returns all events
   */
  public findAll(): Event[] {
    return this.events;
  }

  /**
   * This methods search for an event by a given event id.
   * @param eventId id of the event the caller are looking for
   * @returns the found event or undefined
   */
  public findEvent(eventId: string): Event | undefined {
    return this.events.find((event) => event.id === eventId);
  }

  /**
   * This method stores a new event or replace an existing event.
   * @param dto new or updated event
   */
  public saveEvent(dto: Event): void {
    const idx = this.events.findIndex((event) => event.id === dto.id);

    if (idx < 0) {
      this.events.push(dto);
    } else {
      this.events = [
        ...this.events.slice(0, idx),
        dto,
        ...this.events.slice(idx + 1),
      ];
    }
  }

  /**
   * This method stores a ticket in a event. It throws an
   * error if the event does not exists.
   * @param eventId id of the associated event
   * @param ticket new ticket to be stored in the event
   */
  public saveTicket(eventId: string, ticket: Ticket) {
    const event = this.findEvent(eventId);
    if (event !== undefined) {
      event.tickets.push(ticket);
    } else {
      throw new Error();
    }
  }
}
