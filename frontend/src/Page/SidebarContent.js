import React, { Fragment } from 'react';
import Hamburger from '../widgets/Hamburger';
import './SidebarContent.css';

const SidebarContent = ({ name, links, isSidebarOpen, setIsSidebarOpen }) => {
  const header = (
    <header className='sidebar-header'>
      <h3 className='user-firstname no-mobile-highlight'>{name}</h3>
      <Hamburger
        animation={'hamburger--spin'}
        isActive={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />
    </header>
  );

  return (
    <Fragment>
      {header}
      <nav className='sidebar-nav'>
        <ul>
          {links.map(link => {
            const { href, title } = link;
            return (
              <li key={href}>
                <a href={href} className='no-mobile-highlight'>{title}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    </Fragment>
  );
}

export default SidebarContent;
