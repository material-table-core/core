import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { render } from '@testing-library/react';
import icons from '../src/defaults/props.icons';

// Renders every default icon. If an icon import no longer exists in
// @mui/icons-material (e.g. DeleteOutline removed in MUI v9), the wrapped
// component is undefined and render() throws.
describe('default icons', () => {
  Object.entries(icons).forEach(([name, IconComponent]) => {
    it(`renders ${name}`, () => {
      const { container } = render(<IconComponent />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});
