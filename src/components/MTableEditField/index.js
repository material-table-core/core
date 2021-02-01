import React from 'react';
import PropTypes from 'prop-types';
import LookupField from './LookupField';
import BooleanField from './BooleanField';
import DateField from './DateField';
import TimeField from './TimeField';
import TextField from './TextField';
import DateTimeField from './DateTimeField';
import CurrencyField from './CurrencyField';

function MTableEditField({ forwardedRef, ...props }) {
  let component = 'ok';
  if (props.columnDef.editComponent) {
    component = props.columnDef.editComponent(props);
  } else if (props.columnDef.lookup) {
    component = <LookupField {...props} ref={forwardedRef} />;
  } else if (props.columnDef.type === 'boolean') {
    component = <BooleanField {...props} ref={forwardedRef} />;
  } else if (props.columnDef.type === 'date') {
    component = <DateField {...props} ref={forwardedRef} />;
  } else if (props.columnDef.type === 'time') {
    component = <TimeField {...props} ref={forwardedRef} />;
  } else if (props.columnDef.type === 'datetime') {
    component = <DateTimeField {...props} ref={forwardedRef} />;
  } else if (props.columnDef.type === 'currency') {
    component = <CurrencyField {...props} ref={forwardedRef} />;
  } else {
    component = <TextField {...props} ref={forwardedRef} />;
  }
  return component;
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  locale: PropTypes.object
};

export default React.forwardRef(function MTableEditFieldRef(props, ref) {
  return <MTableEditField {...props} forwardedRef={ref} />;
});
