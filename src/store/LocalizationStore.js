import { create, useStore } from 'zustand';
import React from 'react';
import deepEql from 'deep-eql';
import defaultLocalization from '../defaults/props.localization';
import defaultOptions from '../defaults/props.options';
import defaultIcons from '../defaults/props.icons';
import defaultComponents from '../defaults/props.components';

const merge = require('deepmerge');

const ZustandContext = React.createContext();

const createStore = (props) =>
  create((set) => ({
    // Localization
    localization: merge(defaultLocalization, props.localization ?? {}),
    mergeLocalization: (nextLocalization) => {
      set(({ localization }) => {
        const mergedLocalization = merge(localization, nextLocalization ?? {});
        mergedLocalization.body.editRow.dateTimePickerLocalization =
          mergedLocalization.dateTimePickerLocalization;
        mergedLocalization.body.filterRow.dateTimePickerLocalization =
          mergedLocalization.dateTimePickerLocalization;
        if (!deepEql(mergedLocalization, nextLocalization)) {
          return { localization: mergedLocalization };
        } else {
          return { localization };
        }
      });
    },
    // Options
    options: { ...defaultOptions, ...props.options },
    mergeOptions: (nextOptions) => {
      set(() => {
        const mergedOptions = { ...defaultOptions, ...nextOptions };
        if (!deepEql(mergedOptions, nextOptions)) {
          return { options: mergedOptions };
        } else {
          return { options: defaultOptions };
        }
      });
    },
    //  Icons
    icons: defaultIcons,
    mergeIcons: (nextIcons) => {
      set({
        icons: {
          ...defaultIcons,
          ...nextIcons
        }
      });
    },
    // Components
    components: defaultComponents,
    mergeComponents: (nextComponents) => {
      set(({ components }) => ({
        components: {
          ...components,
          ...nextComponents
        }
      }));
    }
  }));

const useLocalizationStore = () => {
  const store = React.useContext(ZustandContext);
  const localization = useStore(store, (state) => state.localization);
  return localization;
};

const useOptionStore = () => {
  const store = React.useContext(ZustandContext);
  const options = useStore(store, (state) => state.options);
  return options;
};
const useIconStore = () => {
  const store = React.useContext(ZustandContext);
  const icons = useStore(store, (state) => state.icons);
  return icons;
};

function useMergeProps(props) {
  const store = React.useContext(ZustandContext);
  const {
    mergeLocalization,
    mergeOptions,
    mergeIcons,
    mergeComponents,
    localization,
    options,
    icons,
    components
  } = useStore(store, (state) => state);
  React.useEffect(() => {
    if (props.localization) {
      mergeLocalization(props.localization);
    }
  }, [props.localization]);

  React.useEffect(() => {
    if (props.options) {
      mergeOptions(props.options);
    }
  }, [props.options]);
  React.useEffect(() => {
    if (props.icons) {
      mergeIcons(props.icons);
    }
  }, [props.icons]);
  React.useEffect(() => {
    if (props.components) {
      mergeComponents(props.components);
    }
  }, [props.components]);

  return {
    localization,
    options,
    icons,
    components
  };
}

function withContext(WrappedComponent) {
  return function Wrapped(props) {
    const store = React.useRef(createStore(props)).current;
    return (
      <ZustandContext.Provider value={store}>
        <WrappedComponent {...props} />
      </ZustandContext.Provider>
    );
  };
}

export {
  useLocalizationStore,
  useOptionStore,
  useMergeProps,
  withContext,
  useIconStore
};
