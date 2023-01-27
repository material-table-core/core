import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './prop-types';
import MaterialTable from './material-table';
import { useTheme } from '@mui/material/styles';
import { useMergeProps, withContext } from './store/LocalizationStore';

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

export default withContext((props) => {
  const theme = useTheme();
  const { localization, options, components } = useMergeProps(props);
  return (
    <MaterialTable
      {...props}
      theme={theme}
      options={options}
      components={components}
      localization={localization}
      ref={props.tableRef}
    />
  );
});

export {
  MTableAction,
  MTableActions,
  MTableBody,
  MTableBodyRow,
  MTableCell,
  MTableEditCell,
  MTableEditField,
  MTableEditRow,
  MTableFilterRow,
  MTableGroupRow,
  MTableGroupbar,
  MTableHeader,
  MTablePagination,
  MTableSteppedPagination,
  MTableToolbar,
  MTableWrapper
} from './components';

export { ALL_COLUMNS } from './utils/constants';
