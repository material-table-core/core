import React from 'react';
import { TableCell, Collapse } from '@material-ui/core';

function MTableDetailPanel(props) {
  const [isOpen, setOpen] = React.useState(false);
  const renderRef = React.useRef();
  React.useEffect(() => {
    const shouldOpen = Boolean(
      props.data.tableData && props.data.tableData.showDetailPanel
    );
    setTimeout(() => {
      setOpen(shouldOpen);
    }, 5);
  }, [props.data.tableData.showDetailPanel]);

  let renderFunction;
  if (typeof props.detailPanel === 'function') {
    renderFunction = props.detailPanel;
  } else {
    renderFunction = props.detailPanel
      ? props.detailPanel.find(
          (panel) =>
            panel.render.toString() ===
            (props.data.tableData.showDetailPanel || '').toString()
        )
      : undefined;
    renderFunction = renderFunction ? renderFunction.render : null;
  }
  React.useEffect(() => {
    if (renderFunction) {
      renderRef.current = renderFunction;
    }
  });

  return (
    <TableCell
      size={props.size}
      colSpan={
        props.renderColumns.length -
        props.options.detailPanelOffset.left -
        props.options.detailPanelOffset.right
      }
      padding="none"
    >
      <Collapse in={isOpen} timeout="auto" unmountOnExit mountOnEnter>
        {renderFunction
          ? renderFunction(props.data)
          : renderRef.current && renderRef.current(props.data)}
      </Collapse>
    </TableCell>
  );
}

export { MTableDetailPanel };
