/**
 * --- IMPORTANT NOTE FOR CONTRIBUTORS ---
 * Please try to keep this file as
 * clean and clutter free as possible
 * by placing demo components/code at:
 * `./demo-components/index.js`, or if
 * you need a place to store many demo
 * files, `./demo-components/MyComponent/foo.js`
 *
 *
 */

/**
 * --- README ---
 * This file is the entrypoint to the
 * built-in dev server (run `npm start`)
 */

import React from 'react';
import { render } from 'react-dom';
import ErrorBoundary from './errorBoundary';

import { FrankensteinDemo } from './demo-components';

const App = () => {};

module.hot.accept();

render(
  <div>
    <ErrorBoundary>
      <FrankensteinDemo />
    </ErrorBoundary>
  </div>,
  document.querySelector('#app')
);
