import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';

function LookupField({ forwardedRef, ...props }) {
  return (
    <FormControl ref={forwardedRef} error={Boolean(props.error)}>
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
      {Boolean(props.helperText) && (
        <FormHelperText>{props.helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

export default React.forwardRef(function LookupFieldRef(props, ref) {
  return <LookupField {...props} forwardedRef={ref} />;
});
