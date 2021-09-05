import React from 'react';
import { getLocalizedFilterPlaceHolder, getLocalizationData } from './utils';
import { InputAdornment, TextField, Tooltip } from '@mui/material';

function DefaultFilter({
  columnDef,
  icons,
  localization,
  hideFilterIcons,
  onFilterChanged,
  forwardedRef
}) {
  const _localization = getLocalizationData(localization);
  const FilterIcon = icons.Filter;

  return (
    <TextField
      ref={forwardedRef}
      style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
      type={columnDef.type === 'numeric' ? 'number' : 'search'}
      value={columnDef.tableData.filterValue || ''}
      placeholder={getLocalizedFilterPlaceHolder(columnDef, localization)}
      onChange={(event) => {
        onFilterChanged(columnDef.tableData.id, event.target.value);
      }}
      inputProps={{ 'aria-label': `filter data by ${columnDef.title}` }}
      InputProps={
        hideFilterIcons || columnDef.hideFilterIcon
          ? undefined
          : {
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title={_localization.filterTooltip}>
                    <FilterIcon />
                  </Tooltip>
                </InputAdornment>
              )
            }
      }
    />
  );
}

export default React.forwardRef(function DefaultFilterRef(props, ref) {
  return <DefaultFilter {...props} forwardedRef={ref} />;
});
