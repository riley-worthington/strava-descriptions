import React, { Fragment } from 'react';
import Hamburger from '../widgets/Hamburger';
import './SidebarContent.css';

const SidebarContent = ({ name, links, isSidebarOpen, setIsSidebarOpen }) => (
  <Fragment>
    <header className='sidebar-header'>
      <h3 className='user-firstname no-mobile-highlight'>{ name }</h3>
      <Hamburger
        animation={'hamburger--spin'}
        isActive={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />
    </header>
    <nav className='sidebar-nav'>
      <ul>
        {links.map(link => {
          return (
            <li key={link.href}>
              <a href={link.href} className='no-mobile-highlight'>{ link.title }</a>
            </li>
          );
        })}
      </ul>
    </nav>
  </Fragment>
);

export default SidebarContent;
