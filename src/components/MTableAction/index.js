/* eslint-disable multiline-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function MTableAction({
  action: propsAction = defaultProps.action,
  data = defaultProps.data,
  size,
  forwardedRef,
  disabled
}) {
  let action = propsAction;

  if (typeof action === 'function') {
    action = action(data);
    if (!action) {
      return null;
    }
  }

  if (action.action) {
    action = action.action(data);
    if (!action) {
      return null;
    }
  }

  if (action.hidden) {
    return null;
  }

  const isDisabled = action.disabled || disabled;

  const handleOnClick = (event) => {
    if (action.onClick) {
      action.onClick(event, data);
      event.stopPropagation();
    }
  };

  // You may provide events via the "action.handlers" prop. It is an object.
  // The event name is the key, and the value is the handler func.
  const handlers = action.handlers || {};
  const eventHandlers = Object.entries(handlers).reduce((o, [k, v]) => {
    o[k] = (e) => v(e, data);
    return o;
  }, {});

  let icon = null;
  switch (typeof action.icon) {
    case 'string':
      icon = <Icon {...action.iconProps}>{action.icon}</Icon>;
      break;
    case 'function':
      icon = action.icon({ ...action.iconProps, disabled: disabled });
      break;
    case 'undefined':
      icon = null;
      break;
    default:
      icon = <action.icon {...action.iconProps} />;
  }

  const button = (
    <IconButton
      ref={forwardedRef}
      size={size}
      color="inherit"
      disabled={isDisabled}
      onClick={handleOnClick}
      {...eventHandlers}
    >
      {icon}
    </IconButton>
  );

  if (action.tooltip) {
    // fix for issue #1049
    // https://github.com/mbrn/material-table/issues/1049
    return isDisabled ? (
      <Tooltip title={action.tooltip}>
        <span>{button}</span>
      </Tooltip>
    ) : (
      <Tooltip title={action.tooltip}>{button}</Tooltip>
    );
  } else {
    return button;
  }
}

const defaultProps = {
  action: {},
  data: {}
};

MTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  columns: PropTypes.array,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  disabled: PropTypes.bool,
  onColumnsChanged: PropTypes.func,
  size: PropTypes.string
};

export default React.forwardRef(function MTableActionRef(props, ref) {
  return <MTableAction {...props} forwardedRef={ref} />;
});
