import React, { Fragment } from 'react';
import Hamburger from '../widgets/Hamburger';
import Dropdown from '../Dashboard/Dropdown';
import './ResponsiveHeader.css';

const ResponsiveHeader = ({ athleteName, navLinks, setIsSidebarOpen }) => {
  const siteTitle = <h1 className='page-site-title'>TIEMPO</h1>;
  const links = navLinks.map(link => link.href);
  const titles = navLinks.map(link => link.title)

  return (
    <Fragment>
      <header className='mobile-header'>
        <Hamburger
          animation={'hamburger--spin'}
          onClick={() => setIsSidebarOpen(true)}
        />
        {siteTitle}
      </header>
      <header className='desktop-header'>
        {siteTitle}
        <Dropdown
          name={athleteName}
          links={links}
          titles={titles}
        />
      </header>
    </Fragment>
  );
}

export default ResponsiveHeader;
