import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../widgets/Hamburger';
import Dropdown from '../Dashboard/Dropdown';
import './ResponsiveHeader.css';

const ResponsiveHeader = ({
  athleteName, navLinks, isSidebarOpen, setIsSidebarOpen,
}) => {
  const siteTitle = <h1 className='page-site-title'>TIEMPO</h1>;
  const links = navLinks.map(link => link.href);
  const titles = navLinks.map(link => link.title);

  return (
    <Fragment>
      <header className='mobile-header'>
        <Hamburger isActive={isSidebarOpen} animation='hamburger--spin' onClick={() => setIsSidebarOpen(true)} />
        {siteTitle}
      </header>
      <header className='desktop-header'>
        {siteTitle}
        <Dropdown name={athleteName} links={links} titles={titles} />
      </header>
    </Fragment>
  );
};

ResponsiveHeader.defaultProps = {
  athleteName: 'Tiempo User',
  navLinks: [],
  isSidebarOpen: false,
  setIsSidebarOpen: null,
};

ResponsiveHeader.propTypes = {
  athleteName: PropTypes.string,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
};

export default ResponsiveHeader;
