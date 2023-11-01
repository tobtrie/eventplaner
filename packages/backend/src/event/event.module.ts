import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
