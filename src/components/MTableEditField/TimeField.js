import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';

function TimeField({ forwardedRef, ...props }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
      <TimePicker
        {...props}
        ref={forwardedRef}
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

export default React.forwardRef(function TimeFieldRef(props, ref) {
  return <TimeField {...props} forwardedRef={ref} />;
});
