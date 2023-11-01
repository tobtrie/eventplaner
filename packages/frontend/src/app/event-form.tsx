import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ApiError, CreateEventDto, Result } from './model';
import { Reducer } from 'react';
import React from 'react';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string(),
  city: z.string(),
  date: z.date(),
});

type EventFormProps = {
  onAdd: (event: CreateEventDto) => Promise<Result<void, ApiError>>;
};

type State = {
  title: {
    value?: string;
    error?: string;
  };
  city: {
    value?: string;
    error?: string;
  };
  date: {
    value?: Date;
    error?: string;
  };
};

enum ActionTypes {
  ChangeValue,
  SubmitError,
  SubmitSuccessful,
}
type Actions = ChangeValue | SubmitError | SubmitSuccessful;
type ChangeValue = {
  type: ActionTypes.ChangeValue;
  payload: {
    key: keyof State;
    value: State[ChangeValue['payload']['key']]['value'];
  };
};

type SubmitError = {
  type: ActionTypes.SubmitError;
  payload: ApiError;
};

type SubmitSuccessful = {
  type: ActionTypes.SubmitSuccessful;
};

const reducer: Reducer<State, Actions> = (
  state: State,
  action: Actions,
): State => {
  switch (action.type) {
    case ActionTypes.ChangeValue: {
      const { key, value } = action.payload;
      return { ...state, [key]: { ...state[key], value } };
    }
    case ActionTypes.SubmitError: {
      return state;
    }
    case ActionTypes.SubmitSuccessful: {
      return {
        title: { value: '', error: undefined },
        city: { value: '', error: undefined },
        date: { value: undefined, error: undefined },
      };
    }
    default:
      return state;
  }
};

const initialState = {
  title: {},
  city: {},
  date: {},
};

export function EventForm({ onAdd }: EventFormProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  function handlePostData() {
    onAdd({
      title: state.title.value,
      city: state.city.value,
      date: state.date.value?.toISOString(),
    }).then((result) => {
      if (!result.success) {
        dispatch({ type: ActionTypes.SubmitError, payload: result.error });
      } else {
        dispatch({ type: ActionTypes.SubmitSuccessful });
      }
    });
  }
  return (
    <Stack direction="row" gap={1} px={1}>
      <TextField
        label="Title"
        size="small"
        value={state.title.value}
        onChange={(event) =>
          dispatch({
            type: ActionTypes.ChangeValue,
            payload: { key: 'title', value: event.target.value },
          })
        }
        inputProps={{
          'data-testid': 'inp-event-title',
        }}
      />
      <TextField
        label="City"
        size="small"
        value={state.city.value}
        onChange={(event) =>
          dispatch({
            type: ActionTypes.ChangeValue,
            payload: { key: 'city', value: event.target.value },
          })
        }
        inputProps={{
          'data-testid': 'inp-event-city',
        }}
      />
      <DateTimePicker
        label="Date"
        value={state.date.value}
        slotProps={{
          textField: {
            size: 'small',
            inputProps: {
              'data-testid': 'inp-event-date',
            },
          },
        }}
        onChange={(date) =>
          dispatch({
            type: ActionTypes.ChangeValue,
            payload: { key: 'date', value: date ?? undefined },
          })
        }
      />
      <Button
        color="success"
        variant="outlined"
        disabled={
          !eventSchema.safeParse({
            title: state.title.value,
            city: state.city.value,
            date: state.date.value,
          }).success
        }
        startIcon={<SaveOutlined />}
        onClick={handlePostData}
        data-testid="btn-event-save"
      >
        Save
      </Button>
    </Stack>
  );
}
