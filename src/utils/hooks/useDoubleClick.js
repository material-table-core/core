import React from 'react';

function useDoubleClick(singleCallback, dbCallback) {
  const countRef = React.useRef(0);
  /** Refs for the timer **/
  const timerRef = React.useRef(null);
  const inputDoubleCallbackRef = React.useRef(null);
  const inputSingleCallbackRef = React.useRef(null);

  React.useEffect(() => {
    inputDoubleCallbackRef.current = dbCallback;
    inputSingleCallbackRef.current = singleCallback;
  });

  const reset = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    countRef.current = 0;
  };

  const onClick = React.useCallback((e) => {
    const isDoubleClick = countRef.current + 1 === 2;
    const timerIsPresent = timerRef.current;
    if (timerIsPresent && isDoubleClick) {
      reset();
      if (inputDoubleCallbackRef.current) {
        inputDoubleCallbackRef.current(e);
      }
    }
    if (!timerIsPresent) {
      countRef.current = countRef.current + 1;
      const singleClick = () => {
        reset();
        if (inputSingleCallbackRef.current) {
          inputSingleCallbackRef.current(e);
        }
      };
      if (inputDoubleCallbackRef.current) {
        const timer = setTimeout(singleClick, 250);
        timerRef.current = timer;
      } else {
        singleClick();
      }
    }
  }, []);

  return onClick;
}

export { useDoubleClick };
