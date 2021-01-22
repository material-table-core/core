import React, { createElement } from 'react';

function Filter({ columnDef, onFilterChanged, forwardedRef }) {
  return createElement(columnDef.filterComponent, {
    columnDef,
    onFilterChanged,
    forwardedRef
  });
}

export default React.forwardRef(function FilterRef(props, ref) {
  return <Filter {...props} forwardedRef={ref} />;
});
