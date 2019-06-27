import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../widgets/Hamburger';
import './SidebarContent.css';

const SidebarContent = ({
  name, links, isSidebarOpen, setIsSidebarOpen,
}) => (
  <Fragment>
    <header className='sidebar-header'>
      <h3 className='user-firstname no-mobile-highlight'>{name}</h3>
      <Hamburger
        type='button'
        animation='hamburger--spin'
        isActive={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
        onKeyDown={() => setIsSidebarOpen(false)}
        tabIndex='0'
      />
    </header>
    <nav className='sidebar-nav'>
      <ul>
        {links.map(link => (
          <li key={link.href}>
            <a href={link.href} className='no-mobile-highlight'>
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </Fragment>
);

SidebarContent.defaultProps = {
  name: 'Tiempo User',
  links: null,
  isSidebarOpen: true,
  setIsSidebarOpen: null,
};

SidebarContent.propTypes = {
  name: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
};

export default SidebarContent;
