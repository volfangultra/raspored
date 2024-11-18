import React from 'react';
import { Container } from 'semantic-ui-react';

const Footer = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#f5f5f5',
      padding: '10px 0',
      textAlign: 'center',
      borderTop: '1px solid #ccc',
    }}>
      <Container>
        <p style={{ margin: 0 }}>
          <span style={{ color: '#00b5ad' }}>eRaspored</span> © 2024
        </p>
      </Container>
    </div>
  );
};

export default Footer;
