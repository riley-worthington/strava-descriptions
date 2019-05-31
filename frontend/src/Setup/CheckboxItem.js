import React from 'react';
import './CheckboxItem.css';

const CheckboxItem = ({ id, text, onChange }) => {
  return (
    <label className='checkbox-label'>
      <input type="checkbox" id={id} defaultChecked onChange={onChange}/>
      <span className='checkbox-custom'></span>
      <span className='label-text'>{text}</span>
    </label>
  );
}

export default CheckboxItem;
