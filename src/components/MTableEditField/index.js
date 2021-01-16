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

MTableEditCell.defaultProps = {
  columnDef: {},
  localization: {
    saveTooltip: 'Save',
    cancelTooltip: 'Cancel'
  }
};

MTableEditCell.propTypes = {
  cellEditable: PropTypes.object.isRequired,
  columnDef: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  icons: PropTypes.object.isRequired,
  localization: PropTypes.object.isRequired,
  onCellEditFinished: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default React.forwardRef(function MTableEditFieldRef(props, ref) {
  return <MTableEditField {...props} forwardedRef={ref} />;
});
