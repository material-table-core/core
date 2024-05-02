/* eslint-disable no-unused-vars */
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useLocalizationStore, useIconStore } from '@store';
import { Box } from '@mui/material';
import { useOptionStore } from '../../store/LocalizationStore';
/* eslint-enable no-unused-vars */

function MTableGroupbar(props) {
  const localization = useLocalizationStore().grouping;
  const icons = useIconStore();
  const options = useOptionStore();
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
    padding: 1,
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
    props.onGroupChange && props.onGroupChange(props.groupColumns);
  }, [props.groupColumns]);

  return (
    <Toolbar
      className={props.className}
      disableGutters={true}
      ref={props.forwardedRef}
    >
      <Droppable
        droppableId="groups"
        direction="horizontal"
        placeholder="Deneme"
      >
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            sx={getListStyle(snapshot.isDraggingOver)}
          >
            {props.groupColumns.length > 0 && (
              <Typography variant="caption" sx={{ padding: 1 }}>
                {localization.groupedBy}
              </Typography>
            )}
            {props.groupColumns.map((columnDef, index) => {
              return (
                <Draggable
                  key={columnDef.tableData.id.toString()}
                  draggableId={columnDef.tableData.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Chip
                        {...provided.dragHandleProps}
                        {...options.groupChipProps}
                        onClick={() => props.onSortChanged(columnDef)}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ float: 'left' }}>{columnDef.title}</Box>
                            {columnDef.tableData.groupSort && (
                              <icons.SortArrow
                                sx={{
                                  transition: '300ms ease all',
                                  transform:
                                    columnDef.tableData.groupSort === 'asc'
                                      ? 'rotate(-180deg)'
                                      : 'none',
                                  fontSize: 18
                                }}
                              />
                            )}
                          </Box>
                        }
                        sx={{
                          boxShadow: 'none',
                          textTransform: 'none',
                          ...(options.groupChipProps ?? {})
                        }}
                        onDelete={() => props.onGroupRemoved(columnDef, index)}
                      />
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {props.groupColumns.length === 0 && (
              <Typography variant="caption" sx={{ padding: 1 }}>
                {localization.placeholder}
              </Typography>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Toolbar>
  );
}

MTableGroupbar.propTypes = {
  forwardedRef: PropTypes.element,
  className: PropTypes.string,
  onSortChanged: PropTypes.func,
  onGroupRemoved: PropTypes.func,
  onGroupChange: PropTypes.func,
  persistentGroupingsId: PropTypes.string
};

export default React.forwardRef(function MTableGroupbarRef(props, ref) {
  return <MTableGroupbar {...props} forwardedRef={ref} />;
});
