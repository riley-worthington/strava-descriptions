import React from 'react';
import './CheckboxItem.css';

const CheckboxItem = ({ id, text, defaultChecked=true, onChange }) => (
  <label className='checkbox-label no-mobile-highlight'>
    <input type="checkbox" id={id} defaultChecked={defaultChecked} onChange={onChange}/>
    <span className='checkbox-custom'></span>
    <span className='label-text'>{text}</span>
  </label>
);

export default CheckboxItem;
