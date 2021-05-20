import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'renderer/utils';
import './style.scss';

const Spinner = ({ className }) => (
  <div className={classnames('spinner', className)}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

Spinner.propTypes = {
  className: PropTypes.string,
};

export default memo(Spinner);
