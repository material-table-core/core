import React, { useEffect, useState } from 'react';
import { getLocalizedFilterPlaceHolder } from './utils';

import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  variant: 'menu',
  getContentAnchorEl: null
};

function LookupFilter({
  columnDef,
  onFilterChanged,
  localization,
  forwardedRef
}) {
  const [selectedFilter, setSelectedFilter] = useState(
    columnDef.tableData.filterValue || []
  );

  useEffect(() => {
    setSelectedFilter(columnDef.tableData.filterValue || []);
  }, [columnDef.tableData.filterValue]);

  return (
    <FormControl style={{ width: '100%' }} ref={forwardedRef}>
      <InputLabel
        htmlFor={'select-multiple-checkbox' + columnDef.tableData.id}
        style={{ marginTop: -16 }}
      >
        {getLocalizedFilterPlaceHolder(columnDef, localization)}
      </InputLabel>
      <Select
        multiple
        value={selectedFilter}
        onClose={() => {
          if (columnDef.filterOnItemSelect !== true) {
            onFilterChanged(columnDef.tableData.id, selectedFilter);
          }
        }}
        onChange={(event) => {
          setSelectedFilter(event.target.value);
          if (columnDef.filterOnItemSelect === true) {
            onFilterChanged(columnDef.tableData.id, event.target.value);
          }
        }}
        labelId={'select-multiple-checkbox' + columnDef.tableData.id}
        renderValue={(selectedArr) =>
          selectedArr.map((selected) => columnDef.lookup[selected]).join(', ')
        }
        MenuProps={MenuProps}
        style={{ marginTop: 0 }}
      >
        {Object.keys(columnDef.lookup).map((key) => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={selectedFilter.indexOf(key.toString()) > -1} />
            <ListItemText primary={columnDef.lookup[key]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default React.forwardRef(function LookupFilterRef(props, ref) {
  return <LookupFilter {...props} forwardedRef={ref} />;
});
