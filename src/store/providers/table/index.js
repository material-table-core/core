import React from 'react';
import { ProviderFactory } from '@components';
import { tableState, TableContext } from '@store/context';
import { tableReducer } from '@store/reducers';

export default function TableProvider({ children, ...props }) {
  return (
    <ProviderFactory
      reducer={tableReducer}
      defaultState={tableState}
      contextComponent={TableContext}
    >
      {children}
    </ProviderFactory>
  );
}
