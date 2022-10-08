import create from 'zustand';
import createContext from 'zustand/context';
import React from 'react';
import equal from 'fast-deep-equal';
import defaultLocalization from '../defaults/props.localization';
import defaultOptions from '../defaults/props.options';
import defaultIcons from '../defaults/props.icons';
import defaultComponents from '../defaults/props.components';

const merge = require('deepmerge');

const { Provider, useStore } = createContext();

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
        if (!equal(mergedLocalization, nextLocalization)) {
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
        if (!equal(mergedOptions, nextOptions)) {
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
  const localization = useStore((state) => state.localization);
  return localization;
};

const useOptionStore = () => {
  const options = useStore((state) => state.options);
  return options;
};
const useIconStore = () => {
  const icons = useStore((state) => state.icons);
  return icons;
};

function useMergeProps(props) {
  const {
    mergeLocalization,
    mergeOptions,
    mergeIcons,
    mergeComponents,
    localization,
    options,
    icons,
    components
  } = useStore();
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
    return (
      <Provider createStore={() => createStore(props)}>
        <WrappedComponent {...props} />
      </Provider>
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
