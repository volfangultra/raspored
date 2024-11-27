import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onLogout }) => {
  return (
    <div>
      <Header onLogout={onLogout} />
      <div style={{ marginTop: '80px', paddingBottom: '60px' }}>{children}</div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Layout;
