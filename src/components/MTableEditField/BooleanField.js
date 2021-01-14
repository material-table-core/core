import React from 'react';

export default function BooleanField(props) {
  return (
    <FormControl error={Boolean(props.error)} component="fieldset">
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
