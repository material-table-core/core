import React from 'react';
import * as ReactIs from 'react-is';
import PropTypes from 'prop-types';

export const ComponentOverride = (props) => {
  const { targetComponent, ...otherProps } = props;

  if (ReactIs.isValidElementType(targetComponent)) {
    // just capitalize it to feel better
    const Component = targetComponent;
    return <Component {...otherProps} />;
  }

  if (typeof targetComponent === 'object') {
    if (typeof targetComponent.render === 'function') {
      return targetComponent.render(otherProps);
    }
  }

  console.error('Failed to render component');
  return null;
};

ComponentOverride.propTypes = {
  targetComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired
};

export default ComponentOverride;
