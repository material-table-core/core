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

function MTableEditField() {
  function getProps() {
    const {
      columnDef,
      rowData,
      onRowDataChange,
      errorState,
      onBulkEditRowChanged,
      scrollWidth,
      ...props
    } = props;
    return props;
  }

  function renderLookupField() {
    const { helperText, error, ...props } = getProps();
    return (
      <FormControl error={Boolean(error)}>
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

  function renderBooleanField() {
    const { helperText, error, ...props } = getProps();

    return (
      <FormControl error={Boolean(error)} component="fieldset">
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
                  'aria-label': props.columnDef.title,
                }}
              />
            }
          />
        </FormGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  function renderDateField() {
    const dateFormat =
      props.columnDef.dateSetting && props.columnDef.dateSetting.format
        ? props.columnDef.dateSetting.format
        : 'dd.MM.yyyy';
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <DatePicker
          {...getProps()}
          format={dateFormat}
          value={props.value || null}
          onChange={props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            'aria-label': `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderTimeField() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <TimePicker
          {...getProps()}
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
            'aria-label': `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderDateTimeField() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <DateTimePicker
          {...getProps()}
          format="dd.MM.yyyy HH:mm:ss"
          value={props.value || null}
          onChange={props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            'aria-label': `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  function renderTextField() {
    return (
      <TextField
        {...getProps()}
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
          'aria-label': props.columnDef.title,
        }}
      />
    );
  }

  function renderCurrencyField() {
    return (
      <TextField
        {...getProps()}
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
          'aria-label': props.columnDef.title,
        }}
        onKeyDown={props.onKeyDown}
        autoFocus={props.autoFocus}
      />
    );
  }

  function render() {
    let component = 'ok';

    if (this.props.columnDef.editComponent) {
      component = this.props.columnDef.editComponent(this.props);
    } else if (this.props.columnDef.lookup) {
      component = this.renderLookupField();
    } else if (this.props.columnDef.type === 'boolean') {
      component = this.renderBooleanField();
    } else if (this.props.columnDef.type === 'date') {
      component = this.renderDateField();
    } else if (this.props.columnDef.type === 'time') {
      component = this.renderTimeField();
    } else if (this.props.columnDef.type === 'datetime') {
      component = this.renderDateTimeField();
    } else if (this.props.columnDef.type === 'currency') {
      component = this.renderCurrencyField();
    } else {
      component = this.renderTextField();
    }

    return component;
  }

  //________________________
  return render();
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  locale: PropTypes.object
};

export default MTableEditField;
