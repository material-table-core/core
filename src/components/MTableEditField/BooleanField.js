import React from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from '@mui/material';

function BooleanField({ forwardedRef, ...props }) {
  return (
    <FormControl
      error={Boolean(props.error)}
      ref={forwardedRef}
      component="fieldset"
    >
      <FormGroup>
        <FormControlLabel
          label=""
          control={
            <Checkbox
              {...props}
              value={String(props.value)}
              checked={Boolean(props.value)}
              onChange={(event) => props.onChange(event.target.checked)}
              style={{
                padding: 0,
                width: 24,
                marginLeft: 9
              }}
              inputProps={{
                'aria-label': props.columnDef.title
              }}
            />
          }
        />
      </FormGroup>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
}

export default React.forwardRef(function BooleanFieldRef(props, ref) {
  return <BooleanField {...props} forwardedRef={ref} />;
});
