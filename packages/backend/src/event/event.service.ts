import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto, CreateTicketDto, Event, Ticket } from './event.dto';
import { EventRepository } from './event.repository';
import { v4 as uuidv4 } from 'uuid';
import { EventNotFound } from './errors';

@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name);
  constructor(private repository: EventRepository) {}

  /**
   * This method creates a new event from the given DTO
   * and stores it in the repository.
   * @param dto DTO with all necessary data
   * @returns {string} the id of the new event
   */
  public saveEvent(dto: CreateEventDto): string {
    this.logger.verbose(`Try to save a new event`);
    const event = Event.fromCreateDto(uuidv4(), dto);

    this.logger.verbose(`Try to save new event ${event.id}`);
    this.repository.saveEvent(event);
    this.logger.verbose(`Saved a new event with id ${event.id}`);
    return event.id;
  }

  /**
   * Returns all events in the system
   * @returns {Array<Event>}
   */
  public findAllEvents(): Event[] {
    return this.repository.findAll();
  }

  /**
   * Search for the given event id.
   * @param id id of the event the caller is looking for
   * @returns {Event} found event otherwise an error is thrown
   */
  public findEvent(id: string): Event {
    this.logger.verbose(`Try to find event with id ${id}`);
    const event = this.repository.findEvent(id);
    if (event === undefined) {
      this.logger.verbose(`Could not find event with id ${id}`);
      throw new EventNotFound(id);
    }
    this.logger.verbose(`Found event with id ${id}`);
    return event;
  }

  /**
   * Save a new ticket to an event and creates an alphanumeric barcode
   * @param id id the of associated event
   * @param dto data transfer object for the ticket.
   */
  public saveTicket(id: string, dto: CreateTicketDto) {
    this.logger.verbose(
      `Try to create a new ticket for the event with id ${id}`,
    );
    const event = this.findEvent(id);

    const ticket = Ticket.fromCreateDTO(this.generateBarcode(), dto);

    event.tickets.push(ticket);
    this.repository.saveEvent(event);
    this.logger.verbose(
      `Saved a new ticket (barcode ${ticket.barcode}) to the event ${event.id}`,
    );
  }

  /**
   * Generates an alphanumeric string
   * @returns {string} alphanummeric string
   */
  private generateBarcode(): string {
    return Math.random().toString(16).slice(2).substring(0, 8);
  }
}
