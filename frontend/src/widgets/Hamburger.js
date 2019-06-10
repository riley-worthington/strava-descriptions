import React from 'react';
import './Hamburger.css';

const Hamburger = ({ isActive=false, onClick, animation }) => (
  <button className={`hamburger ${animation}${isActive ? ' is-active' : ''}`} type="button" onClick={onClick}>
    <span className="hamburger-box">
      <span className="hamburger-inner"></span>
    </span>
  </button>
);

export default Hamburger;
