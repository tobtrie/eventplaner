'use client';
import React from 'react';
import { ApiError, Event, Result } from './model';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import {
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AddOutlined } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import { Collapse } from '@mui/material';
import { EventForm } from './event-form';

type EventTableProps = {
  events: Event[];
  onSelect: (event: Event) => void;
  onAdd: (
    event: Partial<Omit<Event, 'id' | 'tickets'>>,
  ) => Promise<Result<void, ApiError>>;
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
  },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Date',
    valueFormatter: (params) =>
      new Date(params.value).toLocaleString(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    flex: 1,
  },
];

type EditToolbarProps = {
  onAdd: EventTableProps['onAdd'];
};

function EditToolbar({ onAdd }: EditToolbarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Stack direction="column" gap={1}>
      <GridToolbarContainer sx={{ px: 1 }}>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<AddOutlined />}
          onClick={() => setOpen(!open)}
          data-testid="btn-event-editor"
        >
          Add event
        </Button>
      </GridToolbarContainer>
      <Collapse in={open}>
        <EventForm
          onAdd={(event) =>
            onAdd(event).then((result) => {
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

export function EventTable({ events, onSelect, onAdd }: EventTableProps) {
  function onRowClick(params: GridRowParams<Event>) {
    onSelect?.(params.row);
  }
  return (
    <DataGrid<Event>
      columns={columns}
      rows={events}
      onRowClick={onRowClick}
      autoHeight
      editMode="row"
      slots={{
        noRowsOverlay: () => (
          <Stack direction="column" justifyContent="center" height="100%">
            <Typography textAlign="center" color="gray">
              No events
            </Typography>
          </Stack>
        ),
        toolbar: EditToolbar,
      }}
      slotProps={{
        toolbar: {
          onAdd,
        },
      }}
    />
  );
}
