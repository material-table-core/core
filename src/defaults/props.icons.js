/**
 * Default data for `MaterialTable.icons` attribute
 */

/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { Icon } from '@material-ui/core';

export default {
  Add: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      add_box
    </Icon>
  )),
  Check: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      check
    </Icon>
  )),
  Clear: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      clear
    </Icon>
  )),
  Delete: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      delete_outline
    </Icon>
  )),
  DetailPanel: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      chevron_right
    </Icon>
  )),
  Edit: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      edit
    </Icon>
  )),
  Export: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      save_alt
    </Icon>
  )),
  Filter: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      filter_list
    </Icon>
  )),
  FirstPage: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      first_page
    </Icon>
  )),
  LastPage: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      last_page
    </Icon>
  )),
  NextPage: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      chevron_right
    </Icon>
  )),
  PreviousPage: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      chevron_left
    </Icon>
  )),
  ResetSearch: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      clear
    </Icon>
  )),
  Resize: forwardRef((props, ref) => (
    <Icon
      {...props}
      ref={ref}
      style={{ ...props.style, transform: 'rotate(90deg)' }}
    >
      drag_handle
    </Icon>
  )),
  Search: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      search
    </Icon>
  )),
  SortArrow: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      arrow_downward
    </Icon>
  )),
  ThirdStateCheck: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      remove
    </Icon>
  )),
  ViewColumn: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      view_column
    </Icon>
  )),
  Retry: forwardRef((props, ref) => (
    <Icon {...props} ref={ref}>
      replay
    </Icon>
  ))
};
