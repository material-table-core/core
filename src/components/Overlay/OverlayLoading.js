import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function OverlayLoading(props) {
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
        <CircularProgress />
      </div>
    </div>
  );
}
OverlayLoading.propTypes = {
  theme: PropTypes.any
};

export default React.forwardRef(function OverlayLoadingRef(props, ref) {
  return <OverlayLoading {...props} forwardedRef={ref} />;
});
