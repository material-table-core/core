/* eslint-disable no-unused-vars */
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import * as React from 'react';
/* eslint-enable no-unused-vars */

const MTablePaginationInner = (props) => {
  const handleFirstPageButtonClick = (event) => {
    props.onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    props.onChangePage(event, props.page - 1);
  };

  const handleNextButtonClick = (event) => {
    props.onChangePage(event, props.page + 1);
  };

  const handleNumberButtonClick = (number) => (event) => {
    props.onChangePage(event, number);
  };

  const handleLastPageButtonClick = (event) => {
    props.onChangePage(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1)
    );
  };

  const renderPagesButton = (start, end) => {
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
            minHeight: '30px',
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
  };

  const {
    classes,
    count,
    page,
    rowsPerPage,
    theme,
    showFirstLastPageButtons,
  } = props;

  const localization = {
    ...MTablePaginationInner.defaultProps.localization,
    ...props.localization,
  };
  const maxPages = Math.ceil(count / rowsPerPage) - 1;

  const pageStart = Math.max(page - 1, 0);
  const pageEnd = Math.min(maxPages, page + 1);

  return (
    <div className={classes.root}>
      {showFirstLastPageButtons && (
        <Tooltip title={localization.firstTooltip}>
          <span>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label={localization.firstAriaLabel}
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
          >
            <props.icons.PreviousPage />
          </IconButton>
        </span>
      </Tooltip>
      <Hidden smDown={true}>{renderPagesButton(pageStart, pageEnd)}</Hidden>
      <Tooltip title={localization.nextTooltip}>
        <span>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= maxPages}
            aria-label={localization.nextAriaLabel}
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
    </div>
  );
};

const actionsStyles = (theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
});

MTablePaginationInner.propTypes = {
  onChangePage: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  theme: PropTypes.any,
  showFirstLastPageButtons: PropTypes.bool,
};

MTablePaginationInner.defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstTooltip: 'First Page',
    previousTooltip: 'Previous Page',
    nextTooltip: 'Next Page',
    lastTooltip: 'Last Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:',
  },
};

const MTableSteppedPagination = withStyles(actionsStyles, { withTheme: true })(
  MTablePaginationInner
);

export default MTableSteppedPagination;
