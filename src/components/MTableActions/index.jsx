import React from 'react';
import PropTypes from 'prop-types';

function MTableActions({
  actions,
  columns,
  components,
  data = {},
  onColumnsChanged,
  size,
  disabled,
  forwardedRef
}) {
  if (!actions) {
    return null;
  }
  return (
    <div style={{ display: 'flex' }} ref={forwardedRef}>
      {actions.map((action, index) => (
        <components.Action
          action={action}
          key={'action-' + index}
          columns={columns}
          data={data}
          size={size}
          onColumnsChanged={onColumnsChanged}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

MTableActions.propTypes = {
  columns: PropTypes.array,
  components: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  disabled: PropTypes.bool,
  onColumnsChanged: PropTypes.func,
  size: PropTypes.string,
  forwardedRef: PropTypes.element
};

export default React.forwardRef(function MTableActionsRef(props, ref) {
  return <MTableActions {...props} forwardedRef={ref} />;
});
