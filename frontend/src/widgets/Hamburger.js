import React from 'react';
import PropTypes from 'prop-types';
import './Hamburger.css';

const Hamburger = ({ isActive, onClick, animation }) => (
  <button
    className={`hamburger ${animation}${isActive ? ' is-active' : ''}`}
    type='button'
    onClick={onClick}
  >
    <span className='hamburger-box'>
      <span className='hamburger-inner' />
    </span>
  </button>
);

export default Hamburger;

Hamburger.defaultProps = {
  isActive: false,
  onClick: null,
  animation: '',
};

Hamburger.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  animation: PropTypes.string,
};
