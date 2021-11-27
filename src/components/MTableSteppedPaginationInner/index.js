import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';

function MTablePaginationInner(props) {
  const theme = useTheme();
  const handleFirstPageButtonClick = (event) => {
    props.onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    props.onPageChange(event, props.page - 1);
  };

  const handleNextButtonClick = (event) => {
    props.onPageChange(event, props.page + 1);
  };

  const handleNumberButtonClick = (number) => (event) => {
    props.onPageChange(event, number);
  };

  const handleLastPageButtonClick = (event) => {
    props.onPageChange(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1)
    );
  };

  function renderPagesButton(start, end) {
    const buttons = [];

    for (let p = start; p <= end; p++) {
      const buttonVariant = p === props.page ? 'contained' : 'text';
      buttons.push(
        <Button
          size="small"
          style={{
            boxShadow: 'none',
            maxWidth: '30px',
            maxHeight: '30px',
            minWidth: '30px',
            minHeight: '30px'
          }}
          disabled={p === props.page}
          variant={buttonVariant}
          onClick={handleNumberButtonClick(p)}
          key={p}
        >
          {p + 1}
        </Button>
      );
    }

    return <span>{buttons}</span>;
  }

  function render() {
    const { count, page, rowsPerPage, showFirstLastPageButtons } = props;

    const localization = {
      ...MTablePaginationInner.defaultProps.localization,
      ...props.localization
    };
    const maxPages = Math.ceil(count / rowsPerPage) - 1;

    const pageStart = Math.max(page - 1, 0);
    const pageEnd = Math.min(maxPages, page + 1);

    return (
      <Box
        sx={{ flexShrink: 0, color: 'text.secondary', marginLeft: 2.5 }}
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
              <props.icons.PreviousPage />
            </IconButton>
          </span>
        </Tooltip>
        <Box sx={{ display: { xs: 'false', sm: 'false', md: 'block' } }}>
          {renderPagesButton(pageStart, pageEnd)}
        </Box>
        <Tooltip title={localization.nextTooltip}>
          <span>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= maxPages}
              aria-label={localization.nextAriaLabel}
              size="large"
            >
              <props.icons.NextPage />
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

MTablePaginationInner.propTypes = {
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  theme: PropTypes.any,
  showFirstLastPageButtons: PropTypes.bool
};

MTablePaginationInner.defaultProps = {
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
const MTableSteppedPaginationRef = React.forwardRef(
  function MTableSteppedPaginationRef(props, ref) {
    return <MTablePaginationInner {...props} forwardedRef={ref} />;
  }
);

const MTableSteppedPagination = MTableSteppedPaginationRef;

export default MTableSteppedPagination;
