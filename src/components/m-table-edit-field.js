import React from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
  DateTimePicker
} from '@mui/lab';
import PropTypes from 'prop-types';

class MTableEditField extends React.Component {
  getProps() {
    const {
      columnDef,
      rowData,
      onRowDataChange,
      errorState,
      autoFocus,
      onBulkEditRowChanged,
      scrollWidth,
      ...props
    } = this.props;
    return props;
  }

  renderLookupField() {
    const { helperText, error, ...props } = this.getProps();
    return (
      <FormControl error={Boolean(error)}>
        <Select
          {...props}
          value={this.props.value === undefined ? '' : this.props.value}
          onChange={(event) => this.props.onChange(event.target.value)}
          style={{
            fontSize: 13
          }}
          inputProps={{
            autoFocus: this.props.autoFocus
          }}
          SelectDisplayProps={{ 'aria-label': this.props.columnDef.title }}
        >
          {Object.keys(this.props.columnDef.lookup).map((key) => (
            <MenuItem key={key} value={key}>
              {this.props.columnDef.lookup[key]}
            </MenuItem>
          ))}
        </Select>
        {Boolean(helperText) && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  renderBooleanField() {
    const { helperText, error, ...props } = this.getProps();

    return (
      <FormControl error={Boolean(error)} component="fieldset">
        <FormGroup>
          <FormControlLabel
            label=""
            control={
              <Checkbox
                {...props}
                value={String(this.props.value)}
                checked={Boolean(this.props.value)}
                onChange={(event) => this.props.onChange(event.target.checked)}
                style={{
                  padding: 0,
                  width: 24,
                  marginLeft: 9
                }}
                inputProps={{
                  autoFocus: this.props.autoFocus,
                  'aria-label': this.props.columnDef.title
                }}
              />
            }
          />
        </FormGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  renderDateField() {
    const dateFormat =
      this.props.columnDef.dateSetting &&
      this.props.columnDef.dateSetting.format
        ? this.props.columnDef.dateSetting.format
        : 'dd.MM.yyyy';
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={this.props.locale}
      >
        <DatePicker
          {...this.getProps()}
          renderInput={(props) => <TextField {...props} />}
          format={dateFormat}
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            autoFocus: this.props.autoFocus,
            'aria-label': `${this.props.columnDef.title}: press space to edit`
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTimeField() {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={this.props.locale}
      >
        <TimePicker
          {...this.getProps()}
          renderInput={(props) => <TextField {...props} />}
          format="HH:mm:ss"
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            autoFocus: this.props.autoFocus,
            'aria-label': `${this.props.columnDef.title}: press space to edit`
          }}
        />
      </LocalizationProvider>
    );
  }

  renderDateTimeField() {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={this.props.locale}
      >
        <DateTimePicker
          {...this.getProps()}
          renderInput={(props) => <TextField {...props} />}
          format="dd.MM.yyyy HH:mm:ss"
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13
            }
          }}
          inputProps={{
            autoFocus: this.props.autoFocus,
            'aria-label': `${this.props.columnDef.title}: press space to edit`
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTextField() {
    return (
      <TextField
        {...this.getProps()}
        variant="standard"
        fullWidth
        type={this.props.columnDef.type === 'numeric' ? 'number' : 'text'}
        placeholder={
          this.props.columnDef.editPlaceholder || this.props.columnDef.title
        }
        value={this.props.value === undefined ? '' : this.props.value}
        onChange={(event) =>
          this.props.onChange(
            this.props.columnDef.type === 'numeric'
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
          autoFocus: this.props.autoFocus,
          'aria-label': this.props.columnDef.title,
          style:
            this.props.columnDef.type === 'numeric'
              ? { textAlign: 'right' }
              : {}
        }}
      />
    );
  }

  renderCurrencyField() {
    return (
      <TextField
        {...this.getProps()}
        variant="standard"
        placeholder={
          this.props.columnDef.editPlaceholder || this.props.columnDef.title
        }
        type="number"
        value={this.props.value === undefined ? '' : this.props.value}
        onChange={(event) => {
          let value = event.target.valueAsNumber;
          if (!value && value !== 0) {
            value = undefined;
          }
          return this.props.onChange(value);
        }}
        InputProps={{
          style: {
            fontSize: 13,
            textAlign: 'right'
          }
        }}
        inputProps={{
          autoFocus: this.props.autoFocus,
          'aria-label': this.props.columnDef.title,
          style: { textAlign: 'right' }
        }}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }

  render() {
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
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  locale: PropTypes.object,
  rowData: PropTypes.object,
  onRowDataChange: PropTypes.func,
  errorState: PropTypes.func,
  autoFocus: PropTypes.bool,
  onBulkEditRowChanged: PropTypes.func,
  scrollWidth: PropTypes.number,
  onKeyDown: PropTypes.func
};

export default MTableEditField;
