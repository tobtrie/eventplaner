import { HttpException, HttpStatus } from '@nestjs/common';

export class EventNotFound extends HttpException {
  public message: string;
  constructor(eventId: string) {
    super(
      { message: `Could not find event with id ${eventId}` },
      HttpStatus.NOT_FOUND,
    );
    super.message = `Could not find event with id ${eventId}`;
  }
}
