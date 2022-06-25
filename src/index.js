import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './prop-types';
import MaterialTable from './material-table';
import { withStyles } from '@material-ui/core/styles';
import { useMergeProps, withContext } from './store/LocalizationStore';

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

const styles = (theme) => ({
  paginationRoot: {
    width: '100%'
  },
  paginationToolbar: {
    padding: 0,
    width: '100%'
  },
  paginationCaption: {
    display: 'none'
  },
  paginationSelectRoot: {
    margin: 0
  }
});

export default withContext(
  withStyles(styles, { withTheme: true })((props) => {
    const { localization, options, components } = useMergeProps(props);
    return (
      <MaterialTable
        {...props}
        options={options}
        components={components}
        localization={localization}
        ref={props.tableRef}
      />
    );
  })
);

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
