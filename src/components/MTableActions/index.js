import React from 'react';
import PropTypes from 'prop-types';

export default function MTableActions({
  actions,
  components,
  data,
  size,
  disabled
}) {
  if (!actions) {
    return null;
  }
  return actions.map((action, index) => (
    <components.Action
      action={action}
      key={'action-' + index}
      data={data}
      size={size}
      disabled={disabled}
    />
  ));
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
  size: PropTypes.string
};
