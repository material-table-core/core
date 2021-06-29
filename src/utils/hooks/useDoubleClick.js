import React from 'react';

function useDoubleClick(singleCallback, dbCallback) {
  /** callback ref Pattern **/
  const [elem, setElem] = React.useState(null);
  const callbackRef = React.useCallback((node) => {
    setElem(node);
    callbackRef.current = node;
  }, []);

  const countRef = React.useRef(0);
  /** Refs for the timer **/
  const timerRef = React.useRef(null);
  const inputDoubleCallbackRef = React.useRef(null);
  const inputSingleCallbackRef = React.useRef(null);

  React.useEffect(() => {
    inputDoubleCallbackRef.current = dbCallback;
    inputSingleCallbackRef.current = singleCallback;
  });
  React.useEffect(() => {
    function handler(e) {
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
    }
    if (elem) {
      elem.addEventListener('click', handler);
    }
    return () => {
      if (elem) {
        elem.removeEventListener('click', handler);
      }
    };
  }, [elem]);
  return [callbackRef, elem];
}

export { useDoubleClick };
