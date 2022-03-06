import React from 'react';
import { TableCell, Collapse, TableRow } from '@mui/material';

function MTableDetailPanel(props) {
  const shouldOpen = Boolean(
    props.data.tableData && props.data.tableData.showDetailPanel
  );

  const [isOpen, setOpen] = React.useState(shouldOpen);
  const [, rerender] = React.useReducer((s) => s + 1, 0);
  const renderRef = React.useRef();

  React.useEffect(() => {
    setTimeout(() => {
      setOpen(shouldOpen);
    }, 5);
  }, [shouldOpen]);

  let renderFunction;

  // See issue #282 for more on why we have to check for the existence of props.detailPanel
  if (!props.detailPanel) {
    return <React.Fragment />;
  } else {
    if (typeof props.detailPanel === 'function') {
      renderFunction = props.detailPanel;
    } else {
      renderFunction = props.detailPanel
        ? props.detailPanel
            .map((panel) =>
              typeof panel === 'function' ? panel(props.data) : panel
            )
            .find(
              (panel) =>
                panel.render.toString() ===
                (props.data.tableData.showDetailPanel || '').toString()
            )
        : undefined;
      renderFunction = renderFunction ? renderFunction.render : null;
    }
  }

  React.useEffect(() => {
    if (renderFunction && isOpen) {
      renderRef.current = renderFunction;
    }
  });

  if (!renderRef.current && !props.data.tableData.showDetailPanel) {
    return null;
  }
  const Render = renderFunction || renderRef.current;
  return (
    <TableRow>
      {props.options.detailPanelOffset.left > 0 && (
        <TableCell colSpan={props.options.detailPanelOffset.left} />
      )}
      <TableCell
        size={props.size}
        colSpan={
          props.renderColumns.length -
          props.options.detailPanelOffset.left -
          props.options.detailPanelOffset.right
        }
        padding="none"
      >
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit
          mountOnEnter
          onExited={() => {
            renderRef.current = undefined;
            rerender();
          }}
        >
          {Render({ rowData: props.data })}
        </Collapse>
      </TableCell>
    </TableRow>
  );
}

export { MTableDetailPanel };
