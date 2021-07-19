/* eslint-disable no-unused-vars */
import Toolbar from '@material-ui/core/Toolbar';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
/* eslint-enable no-unused-vars */

function MTableGroupbar(props) {
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // padding: '8px 16px',
    margin: `0 ${8}px 0 0`,

    // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver) => ({
    // background: isDraggingOver ? 'lightblue' : '#0000000a',
    background: '#0000000a',
    display: 'flex',
    width: '100%',
    padding: 8,
    overflow: 'auto',
    border: '1px solid #ccc',
    borderStyle: 'dashed'
  });

  useEffect(() => {
    if (props.persistentGroupingsId) {
      const persistentGroupings = props.groupColumns.map((column) => ({
        field: column.field,
        groupOrder: column.tableData.groupOrder,
        groupSort: column.tableData.groupSort,
        columnOrder: column.tableData.columnOrder
      }));

      let materialTableGroupings = localStorage.getItem(
        'material-table-groupings'
      );
      if (materialTableGroupings) {
        materialTableGroupings = JSON.parse(materialTableGroupings);
      } else {
        materialTableGroupings = {};
      }

      if (persistentGroupings.length === 0) {
        delete materialTableGroupings[props.persistentGroupingsId];

        if (Object.keys(materialTableGroupings).length === 0) {
          localStorage.removeItem('material-table-groupings');
        } else {
          localStorage.setItem(
            'material-table-groupings',
            JSON.stringify(materialTableGroupings)
          );
        }
      } else {
        materialTableGroupings[props.persistentGroupingsId] =
          persistentGroupings;
        localStorage.setItem(
          'material-table-groupings',
          JSON.stringify(materialTableGroupings)
        );
      }
    }
  }, [props.groupColumns]);

  return (
    <Toolbar
      style={{ padding: 0, minHeight: 'unset' }}
      ref={props.forwardedRef}
    >
      <Droppable
        droppableId="groups"
        direction="horizontal"
        placeholder="Deneme"
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.groupColumns.length > 0 && (
              <Typography variant="caption" style={{ padding: 8 }}>
                {props.localization.groupedBy}
              </Typography>
            )}
            {props.groupColumns.map((columnDef, index) => {
              return (
                <Draggable
                  key={columnDef.tableData.id}
                  draggableId={columnDef.tableData.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Chip
                        {...provided.dragHandleProps}
                        onClick={() => props.onSortChanged(columnDef)}
                        label={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <div style={{ float: 'left' }}>
                              {columnDef.title}
                            </div>
                            {columnDef.tableData.groupSort && (
                              <props.icons.SortArrow
                                style={{
                                  transition: '300ms ease all',
                                  transform:
                                    columnDef.tableData.groupSort === 'asc'
                                      ? 'rotate(-180deg)'
                                      : 'none',
                                  fontSize: 18
                                }}
                              />
                            )}
                          </div>
                        }
                        style={{ boxShadow: 'none', textTransform: 'none' }}
                        onDelete={() => props.onGroupRemoved(columnDef, index)}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {props.groupColumns.length === 0 && (
              <Typography variant="caption" style={{ padding: 8 }}>
                {props.localization.placeholder}
              </Typography>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Toolbar>
  );
}

MTableGroupbar.defaultProps = {};

MTableGroupbar.propTypes = {
  localization: PropTypes.shape({
    groupedBy: PropTypes.string,
    placeholder: PropTypes.string
  }),
  forwardedRef: PropTypes.element
};

export default React.forwardRef(function MTableGroupbarRef(props, ref) {
  return <MTableGroupbar {...props} forwardedRef={ref} />;
});
