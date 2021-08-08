// Imported via third-party
import React, { useRef } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { debounce } from 'debounce';
import equal from 'fast-deep-equal/react';
import {
  Table,
  TableFooter,
  TableRow,
  LinearProgress,
  withStyles
} from '@material-ui/core';
// Imported 'internally'
import { propTypes } from '@props/prop-types';
import defaultProps from '@props/defaults';
import DataManager from '@utils/data-manager';
import * as CommonValues from '@utils/common-values';
import {
  MTablePagination,
  MTableSteppedPagination,
  MTableScrollBar
} from '@components';

/**
 * MaterialTable is the default export for this library.
 * @param {Object} props props
 */
export function MaterialTable(props) {
  const tableref = useRef();
}

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

export default MaterialTable;
