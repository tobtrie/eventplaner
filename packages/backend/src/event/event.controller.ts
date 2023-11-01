import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, CreateTicketDto, Event, Ticket } from './event.dto';
import { Response } from 'express';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  public findAll(): Event[] {
    return this.eventService.findAllEvents();
  }

  @Get(':event')
  public findEvent(@Param() eventId: string): Event {
    return this.eventService.findEvent(eventId);
  }

  @Post()
  public saveEvent(@Body() dto: CreateEventDto, @Res() res: Response) {
    const id = this.eventService.saveEvent(dto);
    res.set({ Location: '/events/' + id }).end();
  }

  @Get(':event/tickets')
  public getTickets(@Param('event') eventId: string): Ticket[] {
    const event = this.eventService.findEvent(eventId);
    return event.tickets;
  }

  @Post(':event/tickets')
  public saveTicket(
    @Param('event') eventId: string,
    @Body() ticket: CreateTicketDto,
  ) {
    this.eventService.saveTicket(eventId, ticket);
  }
}
