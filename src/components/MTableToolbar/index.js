import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { lighten, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useLocalizationStore, useIconStore, useOptionStore } from '@store';
import ComponentOverride from '../ComponentOverride';

let searchTimer;

export function MTableToolbar(props) {
  const localization = useLocalizationStore().toolbar;
  const [searchText, setSearchText] = useState(props.searchText);
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = useState(null);
  const [columnsButtonAnchorEl, setColumnsButtonAnchorEl] = useState(null);
  const icons = useIconStore();
  const options = useOptionStore();

  const selectedRows = React.useMemo(
    () => props.originalData.filter((a) => a.tableData.checked),
    [props.originalData]
  );

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
    const data = props.data().map((rowData) =>
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
    if (options.search) {
      return (
        <TextField
          autoFocus={options.searchAutoFocus}
          className={
            options.searchFieldAlignment === 'left' &&
            options.showTitle === false
              ? null
              : props.classes.searchField
          }
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={localization.searchPlaceholder}
          variant={options.searchFieldVariant}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title={localization.searchTooltip}>
                  <icons.Search fontSize="small" />
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
                  <icons.ResetSearch fontSize="small" aria-label="clear" />
                </IconButton>
              </InputAdornment>
            ),
            style: options.searchFieldStyle,
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

  function renderDefaultActions(isSelectionActive) {
    const { classes } = props;
    const diplayedActions = isSelectionActive ? 'toolbarOnSelect' : 'toolbar';
    return (
      <div style={{ display: 'flex' }}>
        {options.columnsButton && !isSelectionActive && (
          <span>
            <Tooltip title={localization.showColumnsTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setColumnsButtonAnchorEl(event.currentTarget)
                }
                aria-label={localization.showColumnsAriaLabel}
              >
                <icons.ViewColumn />
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
        {options.exportMenu.length > 0 && (
          <span>
            <Tooltip title={localization.exportTitle}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setExportButtonAnchorEl(event.currentTarget)
                }
                aria-label={localization.exportAriaLabel}
              >
                <icons.Export />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={exportButtonAnchorEl}
              open={Boolean(exportButtonAnchorEl)}
              onClose={() => setExportButtonAnchorEl(null)}
            >
              {options.exportMenu.map((menuitem, index) => {
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
          <ComponentOverride
            targetComponent={props.components.Actions}
            actions={
              props.actions &&
              props.actions.filter((a) => a.position === diplayedActions)
            }
            data={isSelectionActive ? selectedRows : undefined}
            components={props.components}
          />
        </span>
      </div>
    );
  }

  function renderActions() {
    const { classes } = props;

    return (
      <div className={classes.actions}>
        <div>{renderDefaultActions(selectedRows.length > 0)}</div>
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

  const { classes } = props;
  const title =
    options.showTextRowsSelected && selectedRows.length > 0
      ? typeof localization.nRowsSelected === 'function'
        ? localization.nRowsSelected(selectedRows.length)
        : localization.nRowsSelected.replace('{0}', selectedRows.length)
      : options.showTitle
      ? props.title
      : null;

  return (
    <Toolbar
      ref={props.forwardedRef}
      className={classNames(classes.root, {
        [classes.highlight]:
          options.showTextRowsSelected && selectedRows.length > 0
      })}
    >
      {title && renderToolbarTitle(title)}
      {options.searchFieldAlignment === 'left' && renderSearch()}
      {options.toolbarButtonAlignment === 'left' && renderActions()}
      <div className={classes.spacer} />
      {options.searchFieldAlignment === 'right' && renderSearch()}
      {options.toolbarButtonAlignment === 'right' && renderActions()}
    </Toolbar>
  );
}

MTableToolbar.defaultProps = {
  actions: [],
  columns: [],
  columnsHiddenInColumnsButton: false, // By default, all columns are shown in the Columns Button (columns action when `options.columnsButton = true`)
  searchText: '',
  originalData: [],
  title: 'No Title!'
};

MTableToolbar.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array,
  components: PropTypes.object.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  onColumnsChanged: PropTypes.func.isRequired,
  dataManager: PropTypes.object.isRequired,
  searchText: PropTypes.string,
  onSearchChanged: PropTypes.func.isRequired,
  originalData: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  data: PropTypes.func,
  classes: PropTypes.object
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

export default React.memo(
  withStyles(styles, { name: 'MTableToolbar' })(MTableToolbarRef)
);
