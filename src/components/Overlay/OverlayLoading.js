import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

export default function OverlayLoading(props) {
  return (
    <div
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
