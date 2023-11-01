'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ApiError, Event, Result } from './model';
import { EventTable } from './event-table';
import Collapse from '@mui/material/Collapse';
import { EventDetail } from './event-detail';

async function loadData(): Promise<Event[]> {
  const response = await fetch('http://localhost:3000/events', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return await response.json();
  }

  throw new Error();
}

async function postData(
  event: Partial<Omit<Event, 'id' | 'tickets'>>,
): Promise<void> {
  const response = await fetch('http://localhost:3000/events', {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw response.json();
  }
}

export default function HomePage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, selectEvent] = React.useState<Event>();

  React.useEffect(() => {
    loadData().then(setEvents);
  }, []);

  function handleSelectEvent(event: Event | undefined) {
    if (selectedEvent?.id === event?.id) {
      selectEvent(undefined);
    } else {
      selectEvent(event);
    }
  }

  function handlePostData(
    event: Parameters<typeof postData>['0'],
  ): Promise<Result<void, ApiError>> {
    return new Promise((resolve) => {
      postData(event)
        .then(() => {
          loadData().then(setEvents);
          resolve({ success: true, value: undefined });
        })
        .catch((error: ApiError) => {
          resolve({ success: false, error });
        });
    });
  }

  return (
    <Stack gap={1} direction="row" flexWrap="wrap">
      <EventTable
        events={events}
        onSelect={handleSelectEvent}
        onAdd={handlePostData}
      />
      <Collapse in={selectedEvent !== undefined} orientation="horizontal">
        {selectedEvent && <EventDetail event={selectedEvent} />}
      </Collapse>
    </Stack>
  );
}

