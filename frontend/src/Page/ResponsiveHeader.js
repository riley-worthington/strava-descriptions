import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../widgets/Hamburger';
import './ResponsiveHeader.css';

const ResponsiveHeader = ({
  isSidebarOpen, setIsSidebarOpen,
}) => {
  const siteTitle = <h1 className='page-site-title'>TIEMPO</h1>;

  return (
    <Fragment>
      <header className='page-header'>
        <Hamburger isActive={isSidebarOpen} animation='hamburger--spin' onClick={() => setIsSidebarOpen(true)} />
        {siteTitle}
      </header>
    </Fragment>
  );
};

ResponsiveHeader.defaultProps = {
  isSidebarOpen: false,
  setIsSidebarOpen: null,
};

ResponsiveHeader.propTypes = {
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
};

export default ResponsiveHeader;
