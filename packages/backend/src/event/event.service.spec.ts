import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { CreateEventDto, CreateTicketDto, Event, Ticket } from './event.dto';
import { v4 as uuidv4 } from 'uuid';
import { EventNotFound } from './errors';

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: EventRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [EventService, EventRepository],
    }).compile();

    eventService = app.get<EventService>(EventService);
    eventRepository = app.get<EventRepository>(EventRepository);
  });

  describe('findAllEvents', () => {
    it('should return empty array', () => {
      expect(eventService.findAllEvents()).toEqual([]);
    });

    it('should return all events with tickets', () => {
      const ticket = new Ticket();
      ticket.firstName = 'Tobias';
      ticket.lastName = 'Trienekens';
      ticket.barcode = 'AULS234D';
      const event = new Event();
      event.title = 'Testevent';
      event.date = new Date();
      event.city = 'Cologne';
      event.tickets = [];
      eventRepository.saveEvent(event);

      expect(eventService.findAllEvents()).toEqual([event]);
    });
  });

  describe('findEvent', () => {
    it('find existing event', () => {
      const event = createEvent();
      eventRepository.saveEvent(event);

      const actual = eventService.findEvent(event.id);
      expect(actual).toEqual(event);
    });

    it('search for not existing event', () => {
      const actual = eventService.findEvent(uuidv4());
      expect(actual).toBeUndefined();
    });
  });

  describe('saveEvent', () => {
    it('create a valid event', () => {
      const dto = new CreateEventDto();
      dto.city = 'Cologne';
      dto.date = new Date();
      dto.title = 'Teamevent';
      eventService.saveEvent(dto);

      const allEvents = eventService.findAllEvents();
      expect(allEvents.length).toBe(1);
      const event = allEvents[0];
      expect(event.city).toBe(dto.city);
      expect(event.id).toBeDefined();
      expect(event.date).toEqual(dto.date);
      expect(event.title).toBe(dto.title);
      expect(event.tickets.length).toBe(0);
    });
  });

  describe('saveTicket', () => {
    it('save ticket to existing event', () => {
      const event = createEvent();
      eventRepository.saveEvent(event);

      const createTicket = new CreateTicketDto();
      createTicket.firstName = 'Max';
      createTicket.lastName = 'Mustermann';

      eventService.saveTicket(event.id, createTicket);

      const actual = eventRepository.findEvent(event.id);
      expect(actual).toBeDefined();
      expect(actual.tickets.length).toBe(1);
      expect(actual.tickets[0].firstName).toEqual(createTicket.firstName);
      expect(actual.tickets[0].lastName).toEqual(createTicket.lastName);
      expect(actual.tickets[0].barcode).toBeDefined();

      expect(eventRepository.findAll().length).toBe(1);
    });

    it('save ticket to not existing event', () => {
      const createTicket = new CreateTicketDto();
      createTicket.firstName = 'Max';
      createTicket.lastName = 'Musterman';
      const id = uuidv4();

      expect(() => eventService.saveTicket(id, createTicket)).toThrowError(
        new EventNotFound(id).message,
      );
    });
  });
});

function createEvent(): Event {
  const event = new Event();
  event.id = uuidv4();
  event.city = 'Cologne';
  event.date = new Date();
  event.title = 'Teamevent';
  event.tickets = [];
  return event;
}
