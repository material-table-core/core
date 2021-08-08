import React, { useReducer } from 'react';

export default function ProviderFactory(props) {
  // eslint-disable-next-line react/prop-types
  const {
    reducer,
    defaultState,
    contextComponent: ContextComponent,
    children
  } = props;

  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <ContextComponent.Provider value={{ state, dispatch }}>
      {children}
    </ContextComponent.Provider>
  );
}
