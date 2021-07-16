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
      setTimeout(() => {
        if (!shouldOpen) {
          renderRef.current = null;
        }
      }, 100);
    }, 5);
    if (shouldOpen) {
      if (typeof props.detailPanel === 'function') {
        renderRef.current = props.detailPanel;
      } else {
        renderRef.current = props.detailPanel
          ? props.detailPanel.find(
              (panel) =>
                panel.render.toString() ===
                (props.data.tableData.showDetailPanel || '').toString()
            )
          : undefined;
        renderRef.current = renderRef.current ? renderRef.current.render : null;
      }
    }
  }, [props.data.tableData.showDetailPanel]);
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
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {renderRef.current && renderRef.current(props.data)}
      </Collapse>
    </TableCell>
  );
}

export { MTableDetailPanel };
