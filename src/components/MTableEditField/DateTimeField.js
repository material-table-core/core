import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { LocalizationProvider, DateTimePicker } from '@mui/lab';

function DateTimeField({ forwardedRef, ...props }) {
  return (
    <LocalizationProvider dateAdapter={DateFnsUtils} locale={props.locale}>
      <DateTimePicker
        {...props}
        ref={forwardedRef}
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
    </LocalizationProvider>
  );
}

export default React.forwardRef(function DateTimeFieldRef(props, ref) {
  return <DateTimeField {...props} forwardedRef={ref} />;
});
