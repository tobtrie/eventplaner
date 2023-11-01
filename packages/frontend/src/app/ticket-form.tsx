import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';
import { z } from 'zod';
import { ApiError, CreateTicketDto, Result } from './model';

const ticketSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export type TicketFormProps = {
  onAdd: (ticket: CreateTicketDto) => Promise<Result<void, ApiError>>;
};

export function TicketForm({ onAdd }: TicketFormProps) {
  const [firstName, setFirstName] = React.useState<string | undefined>();
  const [lastName, setLastName] = React.useState<string | undefined>();
  const [errors, setErrors] = React.useState<string[]>([]);

  function handleAddTicket() {
    if (firstName && lastName) {
      onAdd({ firstName, lastName }).then((result: Result<void, ApiError>) => {
        if (!result.success) {
          setErrors(result.error.message);
        } else {
          React.startTransition(() => {
            setFirstName('');
            setLastName('');
          });
        }
      });
    }
  }

  const validation = React.useMemo(
    () => ticketSchema.safeParse({ firstName, lastName }),
    [firstName, lastName],
  );

  return (
    <Stack direction="row" gap={1} px={1} pb={1}>
      <TextField
        label="First name"
        size="small"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        helperText={errors.find((error) => error.includes('firstName'))}
        error={
          errors.find((error) => error.includes('firstName')) !== undefined
        }
        inputProps={{
          'data-testid': 'inp-ticket-firstname',
        }}
      />
      <TextField
        label="Last name"
        size="small"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        helperText={errors.find((error) => error.includes('firstName'))}
        error={errors.find((error) => error.includes('lastName')) !== undefined}
        inputProps={{
          'data-testid': 'inp-ticket-lastname',
        }}
      />
      <Button
        startIcon={<SaveOutlined />}
        color="success"
        variant="outlined"
        disabled={!validation.success}
        onClick={handleAddTicket}
        data-testid="btn-ticket-save"
      >
        Save
      </Button>
    </Stack>
  );
}
