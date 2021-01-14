import React from 'react';
import DateFnsUtils from '@date-io/date-fns';

export default function TimeField(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
      <TimePicker
        {...getProps()}
        format="HH:mm:ss"
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
