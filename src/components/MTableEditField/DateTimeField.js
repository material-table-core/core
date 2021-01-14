import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';

export default function DateTimeField(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
      <DateTimePicker
        {...props}
        format="dd.MM.yyyy HH:mm:ss"
        value={props.value || null}
        onChange={props.onChange}
        clearable
        InputProps={{
          style: {
            fontSize: 13
          }
        }}
        inputProps={{
          'aria-label': `${props.columnDef.title}: press space to edit`
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
