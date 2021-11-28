import * as CommonValues from '@utils/common-values';

export const selectFromObject = (o, s) => {
  if (!s) {
    return;
  }
  let a;
  if (!Array.isArray(s)) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    a = s.split('.');
  } else {
    a = s;
  }
  for (let i = 0, n = a.length; i < n; ++i) {
    const x = a[i];
    if (o && x in o) {
      o = o[x];
    } else {
      return;
    }
  }
  return o;
};

export const setObjectByKey = (obj, path, value) => {
  let schema = obj; // a moving reference to internal objects within obj
  let pList;
  if (!Array.isArray(path)) {
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    pList = path.split('.');
  } else {
    pList = path;
  }
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }
  schema[pList[len - 1]] = value;
};

export function getStyle(props) {
  const width = CommonValues.reducePercentsInCalc(
    props.columnDef.tableData.width,
    props.scrollWidth
  );
  let cellStyle = {
    color: 'inherit',
    width,
    maxWidth: props.columnDef.maxWidth,
    minWidth: props.columnDef.minWidth,
    boxSizing: 'border-box',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'inherit'
  };
  if (typeof props.columnDef.cellStyle === 'function') {
    cellStyle = {
      ...cellStyle,
      ...props.columnDef.cellStyle(props.value, props.rowData)
    };
  } else {
    cellStyle = { ...cellStyle, ...props.columnDef.cellStyle };
  }
  if (props.columnDef.disableClick) {
    cellStyle.cursor = 'default';
  }
  return { ...props.style, ...cellStyle };
}
