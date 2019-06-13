import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

const Dropdown = ({ name, links, titles }) => {
  const [shouldUnderline, setShouldUnderline] = useState(false);

  const toggleUnderline = () => {
    setShouldUnderline(state => !state);
  };

  return (
    <nav className='nav'>
      <ul>
        <li onMouseEnter={toggleUnderline} onMouseLeave={toggleUnderline}>
          <h3 className={`username underline${shouldUnderline ? ' hover' : ''}`}>{name}</h3>
          <ul>
            {links.map((link, i) => {
              const title = titles[i];
              return (
                <li key={link}>
                  <a className='link' href={link} title={title}>
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

Dropdown.defaultProps = {
  name: 'Tiempo User',
  links: [],
  titles: [],
};

Dropdown.propTypes = {
  name: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.string),
  titles: PropTypes.arrayOf(PropTypes.string),
};

export default Dropdown;
