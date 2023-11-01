'use client';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { ApiError, CreateTicketDto, Event, Result, Ticket } from './model';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import AddOutlined from '@mui/icons-material/AddOutlined';
import React from 'react';
import { TicketForm, TicketFormProps } from './ticket-form';

type TicketTableProps = {
  event: Event;
};

const columns: GridColDef[] = [
  {
    field: 'barcode',
    headerName: 'Barcode',
    renderCell: (param: GridRenderCellParams) => <pre>{param.value}</pre>,
    flex: 1,
  },
  {
    field: 'firstName',
    headerName: 'First name',
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    flex: 1,
  },
];

type EditToolbarProps = {
  onAdd: TicketFormProps['onAdd'];
};

function EditToolbar({ onAdd }: EditToolbarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Stack direction="column" gap={1}>
      <GridToolbarContainer sx={{ px: 1 }}>
        <Button
          variant="outlined"
          startIcon={<AddOutlined />}
          color="primary"
          data-testid="btn-ticket-editor"
          onClick={() => setOpen(!open)}
        >
          Add ticket
        </Button>
      </GridToolbarContainer>
      <Collapse in={open}>
        <TicketForm
          onAdd={(ticket) =>
            onAdd(ticket).then((result) => {
              if (result.success) {
                setOpen(false);
              }
              return result;
            })
          }
        />
      </Collapse>
    </Stack>
  );
}

async function handlePostData(
  eventId: string,
  ticket: Parameters<TicketFormProps['onAdd']>['0'],
): Promise<Result<void, ApiError>> {
  const response = await fetch(
    `http://localhost:3000/events/${eventId}/tickets`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(ticket),
    },
  );

  if (response.ok) {
    return Promise.resolve({ success: true, value: undefined });
  }

  return Promise.resolve({ success: false, error: await response.json() });
}

async function loadTickets(
  eventId: string,
): Promise<Result<Ticket[], ApiError>> {
  const response = await fetch(
    `http://localhost:3000/events/${eventId}/tickets`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    return Promise.resolve({ success: false, error: await response.json() });
  }
  return Promise.resolve({ success: true, value: await response.json() });
}

export function TicketTable({ event }: TicketTableProps) {
  const [tickets, setTickets] = React.useState<Ticket[]>();

  React.useEffect(() => {
    loadTickets(event.id).then((result) => {
      if (result.success) {
        setTickets(result.value);
      } else {
        setTickets([]);
      }
    });
  }, [event.id]);
  return (
    <DataGrid<Ticket>
      rows={tickets ?? []}
      loading={tickets === undefined}
      columns={columns}
      getRowId={(row) => row.barcode}
      density="compact"
      autoHeight
      slots={{
        noRowsOverlay: () => (
          <Stack direction="column" justifyContent="center" height="100%">
            <Typography variant="overline" textAlign="center" color="gray">
              No tickets
            </Typography>
          </Stack>
        ),
        toolbar: EditToolbar,
      }}
      slotProps={{
        toolbar: {
          onAdd: (ticket: CreateTicketDto) =>
            handlePostData(event.id, ticket).then((result) => {
              if (result.success) {
                loadTickets(event.id).then((result) => {
                  if (result.success) {
                    setTickets(result.value);
                  }
                });
              }
              return result;
            }),
        },
      }}
    />
  );
}
