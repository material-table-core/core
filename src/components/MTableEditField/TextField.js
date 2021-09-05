import React from 'react';
import { TextField } from '@mui/material';

function MTextField({ forwardedRef, ...props }) {
  return (
    <TextField
      {...props}
      ref={forwardedRef}
      fullWidth
      type={props.columnDef.type === 'numeric' ? 'number' : 'text'}
      placeholder={props.columnDef.editPlaceholder || props.columnDef.title}
      value={props.value === undefined ? '' : props.value}
      onChange={(event) =>
        props.onChange(
          props.columnDef.type === 'numeric'
            ? event.target.valueAsNumber
            : event.target.value
        )
      }
      InputProps={{
        style: {
          minWidth: 50,
          fontSize: 13
        }
      }}
      inputProps={{
        'aria-label': props.columnDef.title,
        style: props.columnDef.type === 'numeric' ? { textAlign: 'right' } : {}
      }}
    />
  );
}

export default React.forwardRef(function MTextFieldRef(props, ref) {
  return <MTextField {...props} forwardedRef={ref} />;
});
