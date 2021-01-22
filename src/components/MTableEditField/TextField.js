import React from 'react';
import { TextField } from '@material-ui/core';

function TextField({ forwardedRef, ...props }) {
  return (
    <TextField
      {...props}
      ref={forwardedRef}
      fullWidth
      style={props.columnDef.type === 'numeric' ? { float: 'right' } : {}}
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
        'aria-label': props.columnDef.title
      }}
    />
  );
}

export default React.forwardRef(function TextFieldRef(props, ref) {
  return <TextField {...props} forwardedRef={ref} />;
});
