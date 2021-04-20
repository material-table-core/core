import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, fade } from '@material-ui/core';

function OverlayLoading(props) {
  return (
    <div
      ref={props.forwardedRef}
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
        backgroundColor: fade(props.theme.palette.background.paper, 0.7)
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
