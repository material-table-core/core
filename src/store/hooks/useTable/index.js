import { useContext } from 'react';

import { tableActions } from '../../actions';
import { TableContext } from '../../context';

export default function useTable() {
  const { state, dispatch } = useContext(TableContext);

  const setTableData = (data) => {
    dispatch({ type: tableActions.SET_DATA, value: data });
  };

  return {
    tableState: state,
    setTableData
  };
}
