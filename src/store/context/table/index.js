import React, { createContext } from 'react';

// Default table state
export const tableState = {
  data: [],
  columns: []
};

// Create context and export
const tableContext = createContext(tableState);
export default tableContext;
