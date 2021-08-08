import React from 'react';
import { ProviderFactory } from '@components';
import { coreState, CoreContext } from '@store/context';
import { coreReducer } from '@store/reducers';

export default function CoreProvider({ children, ...props }) {
  return (
    <ProviderFactory
      reducer={coreReducer}
      defaultState={coreState}
      contextComponent={CoreContext}
    >
      {children}
    </ProviderFactory>
  );
}
