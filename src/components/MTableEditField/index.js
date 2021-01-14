import React from 'react';
import PropTypes from 'prop-types';
import LookupField from './LookupField';
import BooleanField from './BooleanField';
import DateField from './DateField';
import TimeField from './TimeField';
import TextField from './TextField';
import DateTimeField from './DateTimeField';
import CurrencyField from './CurrencyField';

function MTableEditField(props) {
  function render() {
    let component = 'ok';
    if (props.columnDef.editComponent) {
      component = props.columnDef.editComponent(props);
    } else if (props.columnDef.lookup) {
      component = <LookupField {...props} />;
    } else if (props.columnDef.type === 'boolean') {
      component = <BooleanField {...props} />;
    } else if (props.columnDef.type === 'date') {
      component = <DateField {...props} />;
    } else if (props.columnDef.type === 'time') {
      component = <TimeField {...props} />;
    } else if (props.columnDef.type === 'datetime') {
      component = <DateTimeField {...props} />;
    } else if (props.columnDef.type === 'currency') {
      component = <CurrencyField {...props} />;
    } else {
      component = <TextField {...props} />;
    }
    return component;
  }
  return render();
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  locale: PropTypes.object
};

export default MTableEditField;
