import React from 'react';
import { TextField } from '@mui/material';

function CurrencyField({ forwardedRef, ...props }) {
  return (
    <TextField
      {...props}
      ref={forwardedRef}
      placeholder={props.columnDef.editPlaceholder || props.columnDef.title}
      type="number"
      value={props.value === undefined ? '' : props.value}
      onChange={(event) => {
        let value = event.target.valueAsNumber;
        if (!value && value !== 0) {
          value = undefined;
        }
        return props.onChange(value);
      }}
      InputProps={{
        style: {
          fontSize: 13,
          textAlign: 'right'
        }
      }}
      inputProps={{
        'aria-label': props.columnDef.title,
        style: { textAlign: 'right' }
      }}
      onKeyDown={props.onKeyDown}
      autoFocus={props.autoFocus}
    />
  );
}

export default React.forwardRef(function CurrencyFieldRef(props, ref) {
  return <CurrencyField {...props} forwardedRef={ref} />;
});
