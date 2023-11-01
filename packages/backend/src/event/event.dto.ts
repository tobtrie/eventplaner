import { IsNotEmpty, IsDateString, IsDefined, IsString } from 'class-validator';

export class Event {
  id: string;
  title: string;
  date: Date;
  city: string;
  tickets: Ticket[];

  public static create(
    id: string,
    title: string,
    date: Date,
    city: string,
  ): Event {
    const event = new Event();
    event.id = id;
    event.title = title;
    event.date = date;
    event.city = city;
    event.tickets = [];

    return event;
  }

  /**
   * Converts the DTO class to the domain class
   * @param id id of the event
   * @param dto data transfer object
   * @returns {Event} the domain class
   */
  public static fromCreateDto(id: string, dto: CreateEventDto): Event {
    const event = new Event();
    event.id = id;
    event.title = dto.title;
    event.date = new Date(dto.date);
    event.city = dto.city;
    event.tickets = [];
    return event;
  }
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  title: string;
  @IsDateString()
  @IsDefined()
  date: string;
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  city: string;
}

export class Ticket {
  firstName: string;
  lastName: string;
  barcode: string;

  public static fromCreateDTO(barcode: string, dto: CreateTicketDto): Ticket {
    const ticket = new Ticket();

    ticket.firstName = dto.firstName;
    ticket.lastName = dto.lastName;
    ticket.barcode = barcode;

    return ticket;
  }
}

export class CreateTicketDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  public toTicket(barcode: string): Ticket {
    const ticket = new Ticket();
    ticket.firstName = this.firstName;
    ticket.lastName = this.lastName;
    ticket.barcode = barcode;
    return ticket;
  }
}
