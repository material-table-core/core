/* eslint-disable no-unused-vars */
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
/* eslint-enable no-unused-vars */

function MTablePagination(props) {
  const theme = useTheme();
  if (process.env.NODE_ENV === 'development' && !props.onPageChange) {
    console.error(
      'The prop `onPageChange` in pagination is undefined and paging does not work. ' +
        'This is most likely caused by an old material-ui version <= 4.11.X.' +
        'To fix this, install either material-ui >=4.12 or downgrade material-table-core to <=3.0.15.'
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

  function render() {
    const { count, page, rowsPerPage, showFirstLastPageButtons } = props;

    const localization = {
      ...MTablePagination.defaultProps.localization,
      ...props.localization
    };

    return (
      <Box
        sx={{
          flexShrink: 0,
          color: 'text.secondary',
          display: 'flex'
        }}
        ref={props.forwardedRef}
      >
        {showFirstLastPageButtons && (
          <Tooltip title={localization.firstTooltip}>
            <span>
              <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={localization.firstAriaLabel}
                size="large"
              >
                {theme.direction === 'rtl' ? (
                  <props.icons.LastPage />
                ) : (
                  <props.icons.FirstPage />
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
              size="large"
            >
              {theme.direction === 'rtl' ? (
                <props.icons.NextPage />
              ) : (
                <props.icons.PreviousPage />
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
              size="large"
            >
              {theme.direction === 'rtl' ? (
                <props.icons.PreviousPage />
              ) : (
                <props.icons.NextPage />
              )}
            </IconButton>
          </span>
        </Tooltip>
        {showFirstLastPageButtons && (
          <Tooltip title={localization.lastTooltip}>
            <span>
              <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={localization.lastAriaLabel}
                size="large"
              >
                {theme.direction === 'rtl' ? (
                  <props.icons.FirstPage />
                ) : (
                  <props.icons.LastPage />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    );
  }

  return render();
}

MTablePagination.propTypes = {
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  showFirstLastPageButtons: PropTypes.bool
};

MTablePagination.defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstAriaLabel: 'First Page',
    firstTooltip: 'First Page',
    previousAriaLabel: 'Previous Page',
    previousTooltip: 'Previous Page',
    nextAriaLabel: 'Next Page',
    nextTooltip: 'Next Page',
    lastAriaLabel: 'Last Page',
    lastTooltip: 'Last Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:'
  }
};

const MTableGroupRowRef = React.forwardRef(function MTablePaginationRef(
  props,
  ref
) {
  return <MTablePagination {...props} forwardedRef={ref} />;
});

const MTablePaginationOuter = MTableGroupRowRef;

export default MTablePaginationOuter;
