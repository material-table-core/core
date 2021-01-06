/* eslint-disable no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
/* eslint-enable no-unused-vars */

function MTableActions(props) {
  if (props.actions) {
    return props.actions.map((action, index) => (
      <props.components.Action
        action={action}
        key={'action-' + index}
        data={props.data}
        size={props.size}
        disabled={props.disabled}
      />
    ));
  }

  return null;
}

MTableActions.defaultProps = {
  actions: [],
  data: {},
};

MTableActions.propTypes = {
  components: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.string,
};

export default MTableActions;
