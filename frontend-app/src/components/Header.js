import React from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';

const Header = () => {
  return (
    <Menu fixed="top" style={{ backgroundColor: '#f5f5f5', padding: '0 10px', height: '60px', borderBottom: '1px solid #ccc' }}>
      
      {/* Logo */}
      <Menu.Item style={{ padding: '0 15px' }}>
        <Image src="/logo.png" alt="eRaspored" style={{ height: '50px', width: 'auto' }} />
      </Menu.Item>

      {/* User Icon */}
      <Menu.Menu position="right">
        <Menu.Item style={{ padding: '0 10px' }}>
          <Icon name="user circle" color="teal" size="big" />
        </Menu.Item>
      </Menu.Menu>
      
    </Menu>
  );
};

export default Header;
