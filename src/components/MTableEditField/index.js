import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
  DateTimePicker
} from '@material-ui/pickers';
import PropTypes from 'prop-types';

function MTableEditField(props) {
  const {
    rowData,
    error,
    value,
    columnDef,
    helperText,
    onChange,
    locale,
    onKeyDown,
    onRowDataChange,
    autoFocus
  } = props;

  function renderLookupField() {
    return (
      <FormControl error={Boolean(error)}>
        <Select
          {...props}
          value={value === undefined ? '' : value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            fontSize: 13
          }}
          SelectDisplayProps={{ 'aria-label': columnDef.title }}
        >
          {Object.keys(columnDef.lookup).map((key) => (
            <MenuItem key={key} value={key}>
              {columnDef.lookup[key]}
            </MenuItem>
          ))}
        </Select>
        {Boolean(helperText) && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  function renderBooleanField() {
    return (
      <FormControl error={Boolean(error)} component="fieldset">
        <FormGroup>
          <FormControlLabel
            label=""
            control={
              <Checkbox
                {...props}
                value={String(value)}
                checked={Boolean(value)}
                onChange={(event) => onChange(event.target.checked)}
                style={{
                  padding: 0,
                  width: 24,
                  marginLeft: 9
                }}
                inputProps={{
                  'aria-label': columnDef.title
                }}
              />
            }
          />
        </FormGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  function renderTimeField() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        <TimePicker
          {...props}
          format="HH:mm:ss"
          value={value || null}
          onChange={onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            'aria-label': `${columnDef.title}: press space to edit`
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderDateTimeField() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        <DateTimePicker
          {...props}
          format="dd.MM.yyyy HH:mm:ss"
          value={value || null}
          onChange={onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            'aria-label': `${columnDef.title}: press space to edit`
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderDateField() {
    const dateFormat =
      columnDef.dateSetting && columnDef.dateSetting.format
        ? columnDef.dateSetting.format
        : 'dd.MM.yyyy';
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        <DatePicker
          {...props}
          format={dateFormat}
          value={value || null}
          onChange={onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            'aria-label': `${columnDef.title}: press space to edit`
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderTextField() {
    return (
      <TextField
        {...props}
        fullWidth
        style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        type={columnDef.type === 'numeric' ? 'number' : 'text'}
        placeholder={columnDef.editPlaceholder || columnDef.title}
        value={value === undefined ? '' : value}
        onChange={(event) =>
          props.onChange(
            columnDef.type === 'numeric'
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
          'aria-label': columnDef.title
        }}
      />
    );
  }

  function renderCurrencyField() {
    return (
      <TextField
        {...props}
        placeholder={columnDef.editPlaceholder || columnDef.title}
        style={{ float: 'right' }}
        type="number"
        value={value === undefined ? '' : value}
        onChange={(event) => {
          let value = event.target.valueAsNumber;
          if (!value && value !== 0) {
            value = undefined;
          }
          return onChange(value);
        }}
        InputProps={{
          style: {
            fontSize: 13,
            textAlign: 'right'
          }
        }}
        inputProps={{
          'aria-label': columnDef.title
        }}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
    );
  }

  let component = 'ok';

  if (columnDef.editComponent) {
    component = columnDef.editComponent({
      rowData,
      value,
      onChange,
      onRowDataChange,
      columnDef,
      error
    });
  } else if (columnDef.lookup) {
    component = renderLookupField();
  } else if (columnDef.type === 'boolean') {
    component = renderBooleanField();
  } else if (columnDef.type === 'date') {
    component = renderDateField();
  } else if (columnDef.type === 'time') {
    component = renderTimeField();
  } else if (columnDef.type === 'datetime') {
    component = renderDateTimeField();
  } else if (columnDef.type === 'currency') {
    component = renderCurrencyField();
  } else {
    component = renderTextField();
  }

  return component;
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  locale: PropTypes.object
};

export default MTableEditField;
