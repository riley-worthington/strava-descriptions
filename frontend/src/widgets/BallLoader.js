import React from 'react';
import PropTypes from 'prop-types';
import './BallLoader.css';

const BallLoader = ({ id }) => (
  <div id={id} className='balls'>
    <div />
    <div />
    <div />
  </div>
);

export default BallLoader;

BallLoader.defaultProps = {
  id: '',
};

BallLoader.propTypes = {
  id: PropTypes.string,
};
