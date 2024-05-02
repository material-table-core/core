import { defaultProps } from './';

export const getLocalizationData = (localization) => ({
  ...defaultProps.localization,
  ...localization
});

export const getLocalizedFilterPlaceHolder = (columnDef, localization) => {
  return (
    columnDef.filterPlaceholder ||
    getLocalizationData(localization).filterPlaceHolder ||
    ''
  );
};
