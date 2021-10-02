import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@mui/material';

export default function MTableCustomIcon({ icon, iconProps }) {
  if (!icon) {
    return;
  }
  if (typeof icon === 'string') {
    return <Icon {...iconProps}>{icon}</Icon>;
  }
  return React.createElement(icon, { ...iconProps });
}

MTableCustomIcon.defaultProps = {
  iconProps: {}
};

MTableCustomIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType])
    .isRequired,
  iconProps: PropTypes.object
};
