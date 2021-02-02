import { MTableFilterRow } from './';

export const getLocalizationData = (localization) => ({
  ...MTableFilterRow.defaultProps.localization,
  ...localization
});

export const getLocalizedFilterPlaceHolder = (columnDef, localization) => {
  return (
    columnDef.filterPlaceholder ||
    getLocalizationData(localization).filterPlaceHolder ||
    ''
  );
};
