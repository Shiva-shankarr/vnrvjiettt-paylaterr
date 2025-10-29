import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="app-layout">
      <Navigation />
      <div className="d-flex">
        {isAuthenticated && <Sidebar />}
        <Container fluid className="main-content py-4">
          {children}
        </Container>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout; 