import React from 'react';

export default function LookupField(props) {
  return (
    <FormControl error={Boolean(props.error)}>
      <Select
        {...props}
        value={props.value === undefined ? '' : props.value}
        onChange={(event) => props.onChange(event.target.value)}
        style={{
          fontSize: 13
        }}
        SelectDisplayProps={{ 'aria-label': props.columnDef.title }}
      >
        {Object.keys(props.columnDef.lookup).map((key) => (
          <MenuItem key={key} value={key}>
            {props.columnDef.lookup[key]}
          </MenuItem>
        ))}
      </Select>
      {Boolean(helperText) && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
