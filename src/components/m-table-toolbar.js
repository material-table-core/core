/* eslint-disable no-unused-vars */
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import { CsvBuilder } from 'filefy';
import PropTypes from 'prop-types';
import 'jspdf-autotable';
import * as React from 'react';
const jsPDF = typeof window !== 'undefined' ? require('jspdf').jsPDF : null;
/* eslint-enable no-unused-vars */

const MTableToolbar = (props) => {
  const [columnsButtonAnchorEl, setColumnsButtonAnchorEl] = React.useState(
    null
  );
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = React.useState(null);
  const [searchText, setSearchText] = React.useState(props.searchText);

  const onSearchChange = (searchText) => {
    props.dataManager.changeSearchText(searchText);
    setSearchText({ searchText }, props.onSearchChanged(searchText));
  };

  const getTableData = () => {
    const columns = props.columns
      .filter(
        (columnDef) =>
          (!columnDef.hidden || columnDef.export === true) &&
          columnDef.export !== false &&
          columnDef.field
      )
      .sort((a, b) =>
        a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1
      );
    const data = (props.exportAllData
      ? props.data
      : props.renderData
    ).map((rowData) =>
      columns.map((columnDef) => props.getFieldValue(rowData, columnDef))
    );

    return [columns, data];
  };

  const defaultExportCsv = () => {
    const [columns, data] = getTableData();

    let fileName = props.title || 'data';
    if (props.exportFileName) {
      fileName =
        typeof props.exportFileName === 'function'
          ? props.exportFileName()
          : props.exportFileName;
    }

    const builder = new CsvBuilder(fileName + '.csv');
    builder
      .setDelimeter(props.exportDelimiter)
      .setColumns(columns.map((columnDef) => columnDef.title))
      .addRows(data)
      .exportFile();
  };

  const defaultExportPdf = () => {
    if (jsPDF !== null) {
      const [columns, data] = getTableData();

      const content = {
        startY: 50,
        head: [columns.map((columnDef) => columnDef.title)],
        body: data,
      };

      const unit = 'pt';
      const size = 'A4';
      const orientation = 'landscape';

      const doc = new jsPDF(orientation, unit, size);
      doc.setFontSize(15);
      doc.text(props.exportFileName || props.title, 40, 40);
      doc.autoTable(content);
      doc.save((props.exportFileName || props.title || 'data') + '.pdf');
    }
  };

  const exportCsv = () => {
    if (props.exportCsv) {
      props.exportCsv(props.columns, props.data);
    } else {
      defaultExportCsv();
    }
    setExportButtonAnchorEl(null);
  };

  const exportPdf = () => {
    if (props.exportPdf) {
      props.exportPdf(props.columns, props.data);
    } else {
      defaultExportPdf();
    }
    setExportButtonAnchorEl(null);
  };

  const renderSearch = () => {
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization,
    };
    if (props.search) {
      return (
        <TextField
          autoFocus={props.searchAutoFocus}
          className={
            props.searchFieldAlignment === 'left' && props.showTitle === false
              ? null
              : props.classes.searchField
          }
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={localization.searchPlaceholder}
          variant={props.searchFieldVariant}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title={localization.searchTooltip}>
                  <props.icons.Search fontSize="small" />
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!searchText}
                  onClick={() => onSearchChange('')}
                  aria-label={localization.clearSearchAriaLabel}
                >
                  <props.icons.ResetSearch
                    fontSize="small"
                    aria-label="clear"
                  />
                </IconButton>
              </InputAdornment>
            ),
            style: props.searchFieldStyle,
            inputProps: {
              'aria-label': localization.searchAriaLabel,
            },
          }}
        />
      );
    } else {
      return null;
    }
  };

  const renderDefaultActions = () => {
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization,
    };
    const { classes } = props;

    return (
      <div>
        {props.columnsButton && (
          <span>
            <Tooltip title={localization.showColumnsTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setColumnsButtonAnchorEl(event.currentTarget)
                }
                aria-label={localization.showColumnsAriaLabel}
              >
                <props.icons.ViewColumn />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={columnsButtonAnchorEl}
              open={Boolean(columnsButtonAnchorEl)}
              onClose={() => setColumnsButtonAnchorEl(null)}
            >
              <MenuItem
                key={'text'}
                disabled
                style={{
                  opacity: 1,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {localization.addRemoveColumns}
              </MenuItem>

              {/**
               * Add columns to the Columns Button Menu
               * aka the menu that pops up when `MaterialTable.options.columnsButton` is true
               */}
              {this.props.columns.map((col) => {
                const hiddenFromColumnsButtonMenu =
                  col.hiddenByColumnsButton !== undefined
                    ? col.hiddenByColumnsButton
                    : this.props.columnsHiddenInColumnsButton;

                if (hiddenFromColumnsButtonMenu) {
                  return null;
                }

                return (
                  <li key={col.tableData.id}>
                    <MenuItem
                      className={classes.formControlLabel}
                      component="label"
                      htmlFor={`column-toggle-${col.tableData.id}`}
                      disabled={col.removable === false}
                    >
                      <Checkbox
                        checked={!col.hidden}
                        id={`column-toggle-${col.tableData.id}`}
                        onChange={() =>
                          this.props.onColumnsChanged(col, !col.hidden)
                        }
                      />
                      <span>{col.title}</span>
                    </MenuItem>
                  </li>
                );
              })}
              {/** End Add columns to the Columns Button Menu */}
            </Menu>
          </span>
        )}
        {props.exportButton && (
          <span>
            <Tooltip title={localization.exportTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setExportButtonAnchorEl(event.currentTarget)
                }
                aria-label={localization.exportAriaLabel}
              >
                <props.icons.Export />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={exportButtonAnchorEl}
              open={Boolean(exportButtonAnchorEl)}
              onClose={() => setExportButtonAnchorEl(null)}
            >
              {(props.exportButton === true || props.exportButton.csv) && (
                <MenuItem key="export-csv" onClick={exportCsv}>
                  {localization.exportCSVName}
                </MenuItem>
              )}
              {(props.exportButton === true || props.exportButton.pdf) && (
                <MenuItem key="export-pdf" onClick={exportPdf}>
                  {localization.exportPDFName}
                </MenuItem>
              )}
            </Menu>
          </span>
        )}
        <span>
          <props.components.Actions
            actions={
              props.actions &&
              props.actions.filter((a) => a.position === 'toolbar')
            }
            components={props.components}
          />
        </span>
      </div>
    );
  };

  const renderSelectedActions = () => {
    return (
      <React.Fragment>
        <props.components.Actions
          actions={props.actions.filter(
            (a) => a.position === 'toolbarOnSelect'
          )}
          data={props.selectedRows}
          components={props.components}
        />
      </React.Fragment>
    );
  };

  const renderActions = () => {
    const { classes } = props;

    return (
      <div className={classes.actions}>
        <div>
          {props.selectedRows && props.selectedRows.length > 0
            ? renderSelectedActions()
            : renderDefaultActions()}
        </div>
      </div>
    );
  };

  const renderToolbarTitle = (title) => {
    const { classes } = props;
    const toolBarTitle =
      typeof title === 'string' ? (
        <Typography
          variant="h6"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
      ) : (
        title
      );

    return <div className={classes.title}>{toolBarTitle}</div>;
  };

  const { classes } = props;
  const localization = {
    ...MTableToolbar.defaultProps.localization,
    ...props.localization,
  };
  const title =
    props.showTextRowsSelected &&
    props.selectedRows &&
    props.selectedRows.length > 0
      ? typeof localization.nRowsSelected === 'function'
        ? localization.nRowsSelected(props.selectedRows.length)
        : localization.nRowsSelected.replace('{0}', props.selectedRows.length)
      : props.showTitle
      ? props.title
      : null;
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]:
          props.showTextRowsSelected &&
          props.selectedRows &&
          props.selectedRows.length > 0,
      })}
    >
      {title && renderToolbarTitle(title)}
      {props.searchFieldAlignment === 'left' && renderSearch()}
      {props.toolbarButtonAlignment === 'left' && renderActions()}
      <div className={classes.spacer} />
      {props.searchFieldAlignment === 'right' && renderSearch()}
      {props.toolbarButtonAlignment === 'right' && renderActions()}
    </Toolbar>
  );
};

MTableToolbar.defaultProps = {
  actions: [],
  columns: [],
  columnsHiddenInColumnsButton: false, // By default, all columns are shown in the Columns Button (columns action when `options.columnsButton = true`)
  columnsButton: false,
  localization: {
    addRemoveColumns: 'Add or remove columns',
    nRowsSelected: '{0} row(s) selected',
    showColumnsTitle: 'Show Columns',
    showColumnsAriaLabel: 'Show Columns',
    exportTitle: 'Export',
    exportAriaLabel: 'Export',
    exportCSVName: 'Export as CSV',
    exportPDFName: 'Export as PDF',
    searchTooltip: 'Search',
    searchPlaceholder: 'Search',
    searchAriaLabel: 'Search',
    clearSearchAriaLabel: 'Clear Search',
  },
  search: true,
  showTitle: true,
  searchText: '',
  showTextRowsSelected: true,
  toolbarButtonAlignment: 'right',
  searchAutoFocus: false,
  searchFieldAlignment: 'right',
  searchFieldVariant: 'standard',
  selectedRows: [],
  title: 'No Title!',
};

MTableToolbar.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array,
  columnsButton: PropTypes.bool,
  components: PropTypes.object.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  localization: PropTypes.object.isRequired,
  onColumnsChanged: PropTypes.func.isRequired,
  dataManager: PropTypes.object.isRequired,
  searchText: PropTypes.string,
  onSearchChanged: PropTypes.func.isRequired,
  search: PropTypes.bool.isRequired,
  searchFieldStyle: PropTypes.object,
  searchFieldVariant: PropTypes.string,
  selectedRows: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  showTitle: PropTypes.bool.isRequired,
  showTextRowsSelected: PropTypes.bool.isRequired,
  toolbarButtonAlignment: PropTypes.string.isRequired,
  searchFieldAlignment: PropTypes.string.isRequired,
  renderData: PropTypes.array,
  data: PropTypes.array,
  exportAllData: PropTypes.bool,
  exportButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({ csv: PropTypes.bool, pdf: PropTypes.bool }),
  ]),
  exportDelimiter: PropTypes.string,
  exportFileName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  exportCsv: PropTypes.func,
  exportPdf: PropTypes.func,
  classes: PropTypes.object,
  searchAutoFocus: PropTypes.bool,
};

export const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 10%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    overflow: 'hidden',
  },
  searchField: {
    minWidth: 150,
    paddingLeft: theme.spacing(2),
  },
  formControlLabel: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
});

export default withStyles(styles)(MTableToolbar);
