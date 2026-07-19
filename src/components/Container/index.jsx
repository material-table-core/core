import React from 'react';
import { Paper } from '@mui/material';

function Container({ forwardedRef, ...props }) {
  return <Paper elevation={2} {...props} ref={forwardedRef} />;
}

export default React.forwardRef(function ContainerRef(props, ref) {
  return <Container {...props} forwardedRef={ref} />;
});
