/* eslint-disable no-unused-vars */
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as CommonValues from '../../utils/common-values';
import { useLocalizationStore, useIconStore } from '@store/LocalizationStore';
/* eslint-enable no-unused-vars */

function MTablePagination(props) {
  const theme = useTheme();
  const icons = useIconStore();
  const localization = useLocalizationStore().pagination;

  if (process.env.NODE_ENV === 'development' && !props.onPageChange) {
    console.error(
      'The prop `onPageChange` in pagination is undefined and paging does not work. ' +
        'This is most likely caused by an old material-ui version <= 4.11.X.' +
        'To fix this, install either material-ui >=4.12 or downgrade material-table-core to <=3.0.15.'
    );
  }
  if (process.env.NODE_ENV === 'development' && localization.labelRowsSelect) {
    console.warn(
      'The prop `labelRowsSelect` was renamed to labelDisplayedRows. Please rename the prop accordingly: https://mui.com/material-ui/api/table-pagination/#main-content.'
    );
  }
  const handleFirstPageButtonClick = (event) => {
    props.onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    props.onPageChange(event, props.page - 1);
  };

  const handleNextButtonClick = (event) => {
    props.onPageChange(event, props.page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    props.onPageChange(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1)
    );
  };

  const { count, page, rowsPerPage, showFirstLastPageButtons = true } = props;

  const { first, last } = CommonValues.parseFirstLastPageButtons(
    showFirstLastPageButtons,
    theme.direction === 'rtl'
  );
  return (
    <Box
      sx={{
        flexShrink: 0,
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center'
      }}
      ref={props.forwardedRef}
    >
      {first && (
        <Tooltip title={localization.firstTooltip}>
          <span>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label={localization.firstAriaLabel}
              size="large"
            >
              {theme.direction === 'rtl' ? (
                <icons.LastPage />
              ) : (
                <icons.FirstPage />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title={localization.previousTooltip}>
        <span>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label={localization.previousAriaLabel}
          >
            {theme.direction === 'rtl' ? (
              <icons.NextPage />
            ) : (
              <icons.PreviousPage />
            )}
          </IconButton>
        </span>
      </Tooltip>
      <Typography
        variant="caption"
        style={{
          flex: 1,
          textAlign: 'center',
          alignSelf: 'center',
          flexBasis: 'inherit'
        }}
      >
        {localization.labelDisplayedRows
          .replace(
            '{from}',
            props.count === 0 ? 0 : props.page * props.rowsPerPage + 1
          )
          .replace(
            '{to}',
            Math.min((props.page + 1) * props.rowsPerPage, props.count)
          )
          .replace('{count}', props.count)}
      </Typography>
      <Tooltip title={localization.nextTooltip}>
        <span>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label={localization.nextAriaLabel}
          >
            {theme.direction === 'rtl' ? (
              <icons.PreviousPage />
            ) : (
              <icons.NextPage />
            )}
          </IconButton>
        </span>
      </Tooltip>
      {last && (
        <Tooltip title={localization.lastTooltip}>
          <span>
            <IconButton
              onClick={handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label={localization.lastAriaLabel}
              size="large"
            >
              {theme.direction === 'rtl' ? (
                <icons.FirstPage />
              ) : (
                <icons.LastPage />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Box>
  );
}

MTablePagination.propTypes = {
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  showFirstLastPageButtons: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  forwardedRef: PropTypes.func
};

const MTableGroupRowRef = React.forwardRef(function MTablePaginationRef(
  props,
  ref
) {
  return <MTablePagination {...props} forwardedRef={ref} />;
});

const MTablePaginationOuter = MTableGroupRowRef;

export default MTablePaginationOuter;
