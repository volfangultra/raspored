import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ marginTop: '80px', paddingBottom: '60px' }}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
