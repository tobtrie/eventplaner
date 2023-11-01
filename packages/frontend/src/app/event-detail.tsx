'use-client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Event } from './model';
import { TicketTable } from './ticket-table';

type EventDetailProps = {
  event: Event;
};

export function EventDetail({ event }: EventDetailProps) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <header>
        <Typography variant="h5" data-testid="event-detail-title">
          {event?.title}
        </Typography>
        <Stack direction="row" gap={2}>
          <Typography variant="subtitle1" color="gray">
            {event?.city}
          </Typography>
          <Typography variant="subtitle1" color="gray">
            {new Date(event!.date).toLocaleDateString()}
          </Typography>
        </Stack>
      </header>
      <TicketTable event={event} key={event.id} />
    </Paper>
  );
}
