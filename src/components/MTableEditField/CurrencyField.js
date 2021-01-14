import React from 'react';

export default function CurrencyField(props) {
  return (
    <TextField
      {...props}
      placeholder={props.columnDef.editPlaceholder || props.columnDef.title}
      style={{ float: 'right' }}
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
        'aria-label': props.columnDef.title
      }}
      onKeyDown={props.onKeyDown}
      autoFocus={props.autoFocus}
    />
  );
}
