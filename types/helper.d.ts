import React from 'react';

type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type Handlers = Concrete<
  Omit<
    React.DOMAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML'
  >
>;

type OnHandlers<Type> = Partial<
  {
    [Property in keyof Handlers]: (
      event: Parameters<Handlers[Property]>[0],
      rowData: Type
    ) => void;
  }
>;

export type { OnHandlers };
