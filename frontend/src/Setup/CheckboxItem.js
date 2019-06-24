import React from 'react';
import PropTypes from 'prop-types';
import './CheckboxItem.css';

const CheckboxItem = ({
  id, text, checked, onChange,
}) => (
  <label className='checkbox-label no-mobile-highlight' htmlFor={id}>
    <input type='checkbox' id={id} checked={checked} onChange={onChange} value={id} />
    <span className='checkbox-custom' />
    <span className='label-text'>{text}</span>
  </label>
);

export default CheckboxItem;

CheckboxItem.defaultProps = {
  id: null,
  text: '',
  checked: true,
  onChange: () => {},
};

CheckboxItem.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
