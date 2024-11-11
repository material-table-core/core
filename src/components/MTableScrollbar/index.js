import React from 'react';
import { Box } from '@mui/material';

const doubleStyle = {
  overflowX: 'auto',
  position: 'relative'
};

const singleStyle = {
  ...doubleStyle,
  '& ::-webkit-scrollbar': {
    WebkitAppearance: 'none'
  },
  '& ::-webkit-scrollbar:horizontal': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, .3)',
    border: '2px solid white',
    borderRadius: 4
  }
};

const ScrollBar = React.forwardRef(function ScrollBar(
  { double, children, ...props },
  ref
) {
  return (
    <Box sx={double ? doubleStyle : singleStyle} {...props} ref={ref}>
      {children}
    </Box>
  );
});

export default ScrollBar;
