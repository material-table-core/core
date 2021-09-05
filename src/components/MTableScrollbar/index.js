import React from 'react';
import { Box } from '@mui/material';
import DoubleScrollbar from 'react-double-scrollbar';

const horizontalScrollContainer = {
  overflowX: 'auto',
  position: 'relative',
  '& ::-webkit-scrollbar': {
    WebkitAppearance: 'none'
  },
  '& ::-webkit-scrollbar:horizontal': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    borderRadius: 4,
    border: '2px solid white',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  }
};

const ScrollBar = ({ double, children }) => {
  if (double) {
    return <DoubleScrollbar>{children}</DoubleScrollbar>;
  } else {
    return <Box sx={horizontalScrollContainer}>{children}</Box>;
  }
};

export default ScrollBar;
