import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'react-sidebar';
import SidebarContent from './SidebarContent';
import ResponsiveHeader from './ResponsiveHeader';
import './Page.css';

const Page = ({ children, athlete, outLinks }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Sidebar
      sidebar={(
        <SidebarContent
          name={athlete.firstname}
          links={outLinks}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      open={isSidebarOpen}
      sidebarClassName='sidebar'
      onSetOpen={setIsSidebarOpen}
      className='sidebar'
    >
      <ResponsiveHeader
        athleteName={athlete.firstname}
        navLinks={outLinks}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className='child-content'>{children}</div>
    </Sidebar>
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
