import React, { useState } from 'react';
import Sidebar from 'react-sidebar';

import SidebarContent from './SidebarContent';
import ResponsiveHeader from './ResponsiveHeader';

import './Page.css';


const Page = ({ children, athlete, outLinks }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Sidebar
      sidebar={
        <SidebarContent
          name={athlete.firstname}
          links={outLinks}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      }
      open={isSidebarOpen}
      sidebarClassName='sidebar'
      onSetOpen={setIsSidebarOpen}
      className='sidebar'
    >
      <ResponsiveHeader
        athleteName={athlete.firstname}
        navLinks={outLinks}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {children}
    </Sidebar>
  );
}

export default Page;
