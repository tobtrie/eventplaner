import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from './../src/app.module';
import { EventRepository } from './../src/event/event.repository';
import { CreateEventDto, Event } from './../src/event/event.dto';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  let repository: EventRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    repository = moduleFixture.get<EventRepository>(EventRepository);
  });

  describe('GET /events', () => {
    it('empty events', () => {
      return request(app.getHttpServer()).get('/events').expect(200).expect([]);
    });

    it('not empty event list', () => {
      const event = Event.create(uuidv4(), 'Teamevent', new Date(), 'Cologne');
      repository.saveEvent(event);

      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect(JSON.stringify([event]));
    });
  });

  describe('GET /events/:event', () => {
    it('event does not exists', () => {
      const id = uuidv4();
      return request(app.getHttpServer())
        .get('/events/' + id)
        .expect(404);
    });

    it('get existing event', () => {
      const expected = Event.create(
        uuidv4(),
        'Teamevent',
        new Date(),
        'Cologne',
      );
      repository.saveEvent(expected);

      return request(app.getHttpServer())
        .get(`/events/${expected.id}`)
        .get(JSON.stringify(expected));
    });
  });

  describe('POST /events', () => {
    it('Save new event', async () => {
      const expected = new CreateEventDto();
      expected.title = 'Teamevent';
      expected.city = 'Cologne';
      expected.date = new Date().toISOString();
      await request(app.getHttpServer())
        .post('/events')
        .send(JSON.stringify(expected))
        .expect(201, (err, res) => {
          console.log(err, res);
        });
    });

    it('Save invalid event', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send('{"title": "Foo", "date": "foobar"}')
        .expect(400);
    });
  });
});
