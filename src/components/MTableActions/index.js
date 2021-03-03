import React from 'react';
import PropTypes from 'prop-types';

function MTableActions({
  actions,
  components,
  data,
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
          data={data}
          size={size}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

MTableActions.defaultProps = {
  actions: [],
  data: {}
};

MTableActions.propTypes = {
  components: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.string,
  forwardedRef: PropTypes.element
};

export default React.forwardRef(function MTableActionsRef(props, ref) {
  return <MTableActions {...props} forwardedRef={ref} />;
});
