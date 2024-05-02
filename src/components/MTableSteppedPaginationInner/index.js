import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import * as CommonValues from '../../utils/common-values';
import { useLocalizationStore, useIconStore } from '@store';

function MTablePaginationInner(props) {
  const theme = useTheme();
  const localization = useLocalizationStore().pagination;
  const icons = useIconStore();
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

  function renderPagesButton(start, end, maxPages, numberOfPagesAround) {
    const buttons = [];

    // normalize to 1 - 10
    numberOfPagesAround = Math.max(1, Math.min(10, numberOfPagesAround));

    for (
      let p = Math.max(start - numberOfPagesAround + 1, 0);
      p <= Math.min(end + numberOfPagesAround - 1, maxPages);
      p++
    ) {
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

  const {
    count,
    page,
    rowsPerPage,
    showFirstLastPageButtons = true,
    numberOfPagesAround
  } = props;

  const maxPages = Math.ceil(count / rowsPerPage) - 1;

  const pageStart = Math.max(page - 1, 0);
  const pageEnd = Math.min(maxPages, page + 1);
  const { first, last } = CommonValues.parseFirstLastPageButtons(
    showFirstLastPageButtons,
    theme.direction === 'rtl'
  );
  return (
    <Box
      sx={{
        flexShrink: 0,
        color: 'text.secondary',
        marginLeft: 2.5,
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
            <icons.PreviousPage />
          </IconButton>
        </span>
      </Tooltip>
      <Box sx={{ display: { xs: 'false', sm: 'false', md: 'block' } }}>
        {renderPagesButton(pageStart, pageEnd, maxPages, numberOfPagesAround)}
      </Box>
      <Tooltip title={localization.nextTooltip}>
        <span>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= maxPages}
            aria-label={localization.nextAriaLabel}
            size="large"
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

MTablePaginationInner.propTypes = {
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  forwardedRef: PropTypes.func,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  numberOfPagesAround: PropTypes.number,
  classes: PropTypes.object,
  theme: PropTypes.any,
  showFirstLastPageButtons: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ])
};

const MTableSteppedPaginationRef = React.forwardRef(
  function MTableSteppedPaginationRef(props, ref) {
    return <MTablePaginationInner {...props} forwardedRef={ref} />;
  }
);

const MTableSteppedPagination = MTableSteppedPaginationRef;

export default MTableSteppedPagination;
