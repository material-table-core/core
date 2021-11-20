/**
 * Default data for `MaterialTable.icons` attribute
 */

/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { Icon } from '@mui/material';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Replay
} from '@mui/icons-material';

export default {
  Add: forwardRef((props, ref) => (
    <AddBox {...props} ref={ref} data-testid="add_box" />
  )),
  Check: forwardRef((props, ref) => (
    <Check {...props} ref={ref} data-testid="check" />
  )),
  Clear: forwardRef((props, ref) => (
    <Clear {...props} ref={ref} data-testid="clear" />
  )),
  Delete: forwardRef((props, ref) => (
    <DeleteOutline {...props} ref={ref} data-testid="delete_outline" />
  )),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} data-testid="chevron_right" />
  )),
  Edit: forwardRef((props, ref) => (
    <Edit {...props} ref={ref} data-testid="edit" />
  )),
  Export: forwardRef((props, ref) => (
    <SaveAlt {...props} ref={ref} data-testid="save_alt" />
  )),
  Filter: forwardRef((props, ref) => (
    <FilterList {...props} ref={ref} data-testid="filter_list" />
  )),
  FirstPage: forwardRef((props, ref) => (
    <FirstPage {...props} ref={ref} data-testid="first_page" />
  )),
  LastPage: forwardRef((props, ref) => (
    <LastPage {...props} ref={ref} data-testid="last_page" />
  )),
  NextPage: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} data-testid="chevron_right" />
  )),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} data-testid="chevron_left" />
  )),
  ResetSearch: forwardRef((props, ref) => (
    <Clear {...props} ref={ref} data-testid="clear" />
  )),
  Resize: forwardRef((props, ref) => (
    <Icon
      {...props}
      ref={ref}
      style={{ ...props.style }}
      data-testid="drag_handle"
    >
      |
    </Icon>
  )),
  Retry: forwardRef((props, ref) => (
    <Replay {...props} ref={ref} data-testid="replay" />
  )),
  Search: forwardRef((props, ref) => (
    <Search {...props} ref={ref} data-testid="search" />
  )),
  SortArrow: forwardRef((props, ref) => (
    <ArrowDownward {...props} ref={ref} data-testid="arrow_downward" />
  )),
  ThirdStateCheck: forwardRef((props, ref) => (
    <Remove {...props} ref={ref} data-testid="remove" />
  )),
  ViewColumn: forwardRef((props, ref) => (
    <ViewColumn {...props} ref={ref} data-testid="view_column" />
  ))
};
