import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { lighten, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

let searchTimer;

export function MTableToolbar(props) {
  const [state, setState] = React.useState(() => ({
    columnsButtonAnchorEl: null,
    exportButtonAnchorEl: null,
    searchText: props.searchText
  }));

  const onSearchChange = (searchText) => {
    setState({ ...state, searchText });
    props.dataManager.changeSearchText(searchText);
    if (!props.isRemoteData) {
      props.onSearchChanged(searchText);
      return;
    }

    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      props.onSearchChanged(searchText);
      searchTimer = null;
    }, props.searchDebounceDelay);
  };

  const getTableData = () => {
    const columns = props.columns
      .filter(
        (columnDef) =>
          (!columnDef.hidden || columnDef.export === true) &&
          columnDef.field &&
          columnDef.export !== false
      )
      .sort((a, b) =>
        a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1
      );
    const data = (props.exportAllData ? props.data : props.renderData).map(
      (rowData) =>
        columns.map((columnDef) => {
          /*
          About: column.customExport
          This bit of code checks if prop customExport in column is a function, and if it is then it
          uses that function to transform the data, this is useful in cases where a column contains
          complex objects or array and it needs to be handled before it's passed to the exporter 
          to avoid [object Object] output (e.g. to flatten data). 
          Please note that it is also possible to transform data within under exportMenu 
          using a custom function (exportMenu.exportFunc) for each exporter.
          */
          if (typeof columnDef.customExport === 'function') {
            return columnDef.customExport(rowData);
          }
          return props.getFieldValue(rowData, columnDef);
        })
    );

    return [columns, data];
  };

  function renderSearch() {
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization
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
          value={state.searchText}
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
                  disabled={!state.searchText}
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
              'aria-label': localization.searchAriaLabel
            }
          }}
        />
      );
    } else {
      return null;
    }
  }

  function renderDefaultActions() {
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization
    };
    const { classes } = props;

    return (
      <div style={{ display: 'flex' }}>
        {props.columnsButton && (
          <span>
            <Tooltip title={localization.showColumnsTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setState({
                    ...state,
                    columnsButtonAnchorEl: event.currentTarget
                  })
                }
                aria-label={localization.showColumnsAriaLabel}
              >
                <props.icons.ViewColumn />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={state.columnsButtonAnchorEl}
              open={Boolean(state.columnsButtonAnchorEl)}
              onClose={() =>
                setState({ ...state, columnsButtonAnchorEl: null })
              }
            >
              <MenuItem
                key={'text'}
                disabled
                style={{
                  opacity: 1,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                {localization.addRemoveColumns}
              </MenuItem>

              {/**
               * Add columns to the Columns Button Menu
               * aka the menu that pops up when `MaterialTable.options.columnsButton` is true
               */}
              {props.columns.map((col) => {
                const hiddenFromColumnsButtonMenu =
                  col.hiddenByColumnsButton !== undefined
                    ? col.hiddenByColumnsButton
                    : props.columnsHiddenInColumnsButton;

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
                          props.onColumnsChanged(col, !col.hidden)
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
        {props.exportMenu.length > 0 && (
          <span>
            <Tooltip title={localization.exportTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setState({
                    ...state,
                    exportButtonAnchorEl: event.currentTarget
                  })
                }
                aria-label={localization.exportAriaLabel}
              >
                <props.icons.Export />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={state.exportButtonAnchorEl}
              open={Boolean(state.exportButtonAnchorEl)}
              onClose={() => setState({ ...state, exportButtonAnchorEl: null })}
            >
              {props.exportMenu.map((menuitem, index) => {
                const [cols, datas] = getTableData();
                return (
                  <MenuItem
                    key={`${menuitem.label}${index}`}
                    onClick={() => {
                      menuitem.exportFunc(cols, datas);
                      setState({ exportButtonAnchorEl: null });
                    }}
                  >
                    {menuitem.label}
                  </MenuItem>
                );
              })}
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
  }

  function renderSelectedActions() {
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
  }

  function renderActions() {
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
  }

  function renderToolbarTitle(title) {
    const { classes } = props;
    const toolBarTitle =
      // eslint-disable-next-line multiline-ternary
      typeof title === 'string' ? (
        <Typography
          variant="h6"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      ) : (
        title
      );

    return <div className={classes.title}>{toolBarTitle}</div>;
  }

  function render() {
    const { classes } = props;
    const localization = {
      ...MTableToolbar.defaultProps.localization,
      ...props.localization
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
        ref={props.forwardedRef}
        className={classNames(classes.root, {
          [classes.highlight]:
            props.showTextRowsSelected &&
            props.selectedRows &&
            props.selectedRows.length > 0
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
  }

  return render();
}

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
    searchTooltip: 'Search',
    searchPlaceholder: 'Search',
    searchAriaLabel: 'Search',
    clearSearchAriaLabel: 'Clear Search'
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
  title: 'No Title!'
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
  exportMenu: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      handler: PropTypes.func
    })
  ),
  classes: PropTypes.object,
  searchAutoFocus: PropTypes.bool
};

export const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 10%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    overflow: 'hidden'
  },
  searchField: {
    minWidth: 150,
    paddingLeft: theme.spacing(2)
  },
  formControlLabel: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
});

const MTableToolbarRef = React.forwardRef(function MTableToolbarRef(
  props,
  ref
) {
  return <MTableToolbar {...props} forwardedRef={ref} />;
});

export default withStyles(styles)(MTableToolbarRef);
