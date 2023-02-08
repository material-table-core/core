import React from 'react';
import { Checkbox } from '@mui/material';

function BooleanFilter({ forwardedRef, columnDef, onFilterChanged }) {
  return (
    <Checkbox
      ref={forwardedRef}
      inputProps={{ 'aria-label': `Filter of ${columnDef.title}` }}
      indeterminate={columnDef.tableData.filterValue === undefined}
      checked={columnDef.tableData.filterValue === 'checked'}
      onChange={() => {
        let val;
        if (columnDef.tableData.filterValue === undefined) {
          val = 'checked';
        } else if (columnDef.tableData.filterValue === 'checked') {
          val = 'unchecked';
        }
        onFilterChanged(columnDef.tableData.id, val);
      }}
    />
  );
}

export default React.forwardRef(function BooleanFilterRef(props, ref) {
  return <BooleanFilter {...props} forwardedRef={ref} />;
});
