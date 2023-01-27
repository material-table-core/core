import { Box } from '@mui/material';
import React from 'react';

const MTableWrapper = ({ children, sx }) => {
  return <Box sx={sx}>{children}</Box>;
};

export default MTableWrapper;
