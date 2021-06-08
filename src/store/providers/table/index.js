import React, { useReducer } from 'react';
import { tableState, TableContext } from '../../context';
import { tableReducer } from '../../reducers';

const TableProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  const [state, dispatch] = useReducer(tableReducer, tableState);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;
