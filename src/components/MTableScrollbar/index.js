import React from 'react';
import { withStyles } from '@material-ui/core';
import DoubleScrollbar from 'react-double-scrollbar';

const style = () => ({
  horizontalScrollContainer: {
    '& ::-webkit-scrollbar': {
      '-webkit-appearance': 'none'
    },
    '& ::-webkit-scrollbar:horizontal': {
      height: 8
    },
    '& ::-webkit-scrollbar-thumb': {
      borderRadius: 4,
      border: '2px solid white',
      backgroundColor: 'rgba(0, 0, 0, .3)'
    }
  }
});

const ScrollBar = withStyles(style)(({ double, children, classes }) => {
  if (double) {
    return <DoubleScrollbar>{children}</DoubleScrollbar>;
  } else {
    return (
      <div
        className={classes.horizontalScrollContainer}
        style={{ overflowX: 'auto', position: 'relative' }}
      >
        {children}
      </div>
    );
  }
});

export default ScrollBar;
