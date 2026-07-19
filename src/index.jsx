import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './prop-types';
import MaterialTable from './material-table';
import { useTheme } from '@mui/material/styles';
import {
  useMergeProps,
  withContext,
  useLocalizationStore
} from './store/LocalizationStore';

MaterialTable.propTypes = propTypes;

export default withContext((userProps) => {
  const props = { ...defaultProps, ...userProps };
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

export { useLocalizationStore };

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
  MTableToolbar
} from './components';

export { ALL_COLUMNS } from './utils/constants';
