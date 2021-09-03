/* eslint-disable multiline-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function MTableAction(props) {
  function render() {
    let action = props.action;

    if (typeof action === 'function') {
      action = action(props.data);
      if (!action) {
        return null;
      }
    }

    if (action.action) {
      action = action.action(props.data);
      if (!action) {
        return null;
      }
    }

    if (action.hidden) {
      return null;
    }

    const disabled = action.disabled || props.disabled;

    const handleOnClick = (event) => {
      if (action.onClick) {
        action.onClick(event, props.data);
        event.stopPropagation();
      }
    };

    // You may provide events via the "action.handers" prop. It is an object.
    // The event name is the key, and the value is the handler func.
    const handlers = action.handlers || {};
    const eventHandlers = Object.entries(handlers).reduce((o, [k, v]) => {
      o[k] = (e) => v(e, props.data);
      return o;
    }, {});

    const icon =
      typeof action.icon === 'string' ? (
        <Icon {...action.iconProps}>{action.icon}</Icon>
      ) : typeof action.icon === 'function' ? (
        action.icon({ ...action.iconProps, disabled: disabled })
      ) : (
        <action.icon />
      );

    const button = (
      <IconButton
        ref={props.forwardedRef}
        size={props.size}
        color="inherit"
        disabled={disabled}
        onClick={handleOnClick}
        {...eventHandlers}
      >
        {icon}
      </IconButton>
    );

    if (action.tooltip) {
      // fix for issue #1049
      // https://github.com/mbrn/material-table/issues/1049
      return disabled ? (
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

  return render();
}

MTableAction.defaultProps = {
  action: {},
  data: {}
};

MTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.string
};

export default React.forwardRef(function MTableActionRef(props, ref) {
  return <MTableAction {...props} forwardedRef={ref} />;
});
