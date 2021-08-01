import React from 'react';

function useDoubleClick(singleCallback, dbCallback, persistEvents) {
  const countRef = React.useRef(0);
  /** Refs for the timer **/
  const timerRef = React.useRef(null);
  const inputDoubleCallbackRef = React.useRef(null);
  const inputSingleCallbackRef = React.useRef(null);

  React.useEffect(() => {
    inputDoubleCallbackRef.current = dbCallback;
    inputSingleCallbackRef.current = singleCallback;
  });
  const onClick = React.useCallback((e) => {
    if (persistEvents) {
      e.persist();
    }
    const isDoubleClick = countRef.current + 1 === 2;
    const timerIsPresent = timerRef.current;
    if (timerIsPresent && isDoubleClick) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      countRef.current = 0;
      if (inputDoubleCallbackRef.current) {
        inputDoubleCallbackRef.current(e);
      }
    }
    if (!timerIsPresent) {
      countRef.current = countRef.current + 1;
      const timer = setTimeout(() => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        countRef.current = 0;
        if (inputSingleCallbackRef.current) {
          inputSingleCallbackRef.current(e);
        }
      }, 200);
      timerRef.current = timer;
    }
  }, []);
  return onClick;
}

export { useDoubleClick };
