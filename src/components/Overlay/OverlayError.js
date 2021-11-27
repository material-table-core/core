import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

function OverlayError(props) {
  const theme = useTheme();
  return (
    <div
      ref={props.forwardedRef}
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        opacity: 0.7
      }}
    >
      <div
        style={{
          display: 'table-cell',
          width: '100%',
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'center'
        }}
      >
        <span>{props.error.message}</span>{' '}
        <props.icon
          onClick={props.retry}
          style={{ cursor: 'pointer', position: 'relative', top: 5 }}
        />
      </div>
    </div>
  );
}

OverlayError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  retry: PropTypes.func,
  theme: PropTypes.any,
  icon: PropTypes.any
};

export default React.forwardRef(function OverlayErrorRef(props, ref) {
  return <OverlayError {...props} forwardedRef={ref} />;
});
