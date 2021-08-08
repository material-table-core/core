import { useContext } from 'react';

import { tableActions } from '@store/actions';
import { TableContext } from '@store/context';

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
