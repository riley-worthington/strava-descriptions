import React from 'react';
import PropTypes from 'prop-types';
import './CheckboxItem.css';

const CheckboxItem = ({
  id, text, defaultChecked, onChange,
}) => (
  <label className='checkbox-label no-mobile-highlight' htmlFor={id}>
    <input type='checkbox' id={id} defaultChecked={defaultChecked} onChange={onChange} />
    <span className='checkbox-custom' />
    <span className='label-text'>{text}</span>
  </label>
);

export default CheckboxItem;

CheckboxItem.defaultProps = {
  id: null,
  text: '',
  defaultChecked: true,
  onChange: null,
};

CheckboxItem.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
};
