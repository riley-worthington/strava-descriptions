import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SidebarContent from './SidebarContent';
import ResponsiveHeader from './ResponsiveHeader';
import './Page.css';

const Page = ({ children, athlete, outLinks }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='page-content'>
      <div className={`test-sidebar${isSidebarOpen ? ' open' : ''}`}>
        <SidebarContent
          name={athlete.firstname}
          links={outLinks}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        className={`overlay${isSidebarOpen ? ' open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        onKeyDown={() => setIsSidebarOpen(false)}
        role='button'
        tabIndex='-1'
      />
      <ResponsiveHeader
        athleteName={athlete.firstname}
        navLinks={outLinks}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className='child-content'>{children}</div>
    </div>
  );
};

Page.propTypes = {
  athlete: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  children: PropTypes.node,
  outLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
};

Page.defaultProps = {
  children: null,
  outLinks: [],
};

export default Page;
