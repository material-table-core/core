import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

let searchTimer;

export function MTableToolbar(props) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState(props.searchText);
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = useState(null);
  const [columnsButtonAnchorEl, setColumnsButtonAnchorEl] = useState(null);

  const onSearchChange = (searchText) => {
    setSearchText(searchText);
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
        columns.reduce((agg, columnDef) => {
          let value;
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
            value = columnDef.customExport(rowData);
          } else {
            value = props.getFieldValue(rowData, columnDef);
          }
          agg[columnDef.field] = value;
          return agg;
        }, {})
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
          sx={
            props.searchFieldAlignment === 'left' && props.showTitle === false
              ? undefined
              : styles.searchField
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

    return (
      <div style={{ display: 'flex' }}>
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
                      sx={styles.formControlLabel}
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
              {props.exportMenu.map((menuitem, index) => {
                const [cols, datas] = getTableData();
                return (
                  <MenuItem
                    key={`${menuitem.label}${index}`}
                    onClick={() => {
                      menuitem.exportFunc(cols, datas, {
                        searchedData: props.dataManager.searchedData,
                        filteredData: props.dataManager.filteredData,
                        groupedData: props.dataManager.groupedData
                      });
                      setExportButtonAnchorEl(null);
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
    return (
      <Box sx={styles.actions}>
        <div>
          {props.selectedRows && props.selectedRows.length > 0
            ? renderSelectedActions()
            : renderDefaultActions()}
        </div>
      </Box>
    );
  }

  function renderToolbarTitle(title) {
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

    return <Box sx={styles.title}>{toolBarTitle}</Box>;
  }

  function render() {
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
        className={props.className}
        sx={{
          ...styles.root,
          ...(props.showTextRowsSelected &&
          props.selectedRows &&
          props.selectedRows.length > 0
            ? styles.highlight(theme)
            : {})
        }}
      >
        {title && renderToolbarTitle(title)}
        {props.searchFieldAlignment === 'left' && renderSearch()}
        {props.toolbarButtonAlignment === 'left' && renderActions()}
        <Box sx={styles.spacer} />
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
  className: PropTypes.string,
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
  searchAutoFocus: PropTypes.bool
};

const styles = {
  root: {
    paddingRight: 1,
    paddingLeft: 2
  },
  highlight: (theme) =>
    theme.palette.mode === 'light'
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
    color: 'text.secondary'
  },
  title: {
    overflow: 'hidden'
  },
  searchField: {
    minWidth: 150,
    paddingLeft: 2
  },
  formControlLabel: {
    px: 1
  }
};

const MTableToolbarRef = React.forwardRef(function MTableToolbarRef(
  props,
  ref
) {
  return <MTableToolbar {...props} forwardedRef={ref} />;
});

export default MTableToolbarRef;
