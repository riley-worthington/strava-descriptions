import React from 'react';
import './BallLoader.css';

const BallLoader = ({ id }) => {
  return (
    <div id={id} className="balls">
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default BallLoader;
