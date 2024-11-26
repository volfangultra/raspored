import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Image, Dropdown } from 'semantic-ui-react';

const Header = ({ onLogout }) => {
  return (
    <Menu fixed="top" style={{ backgroundColor: '#f5f5f5', padding: '0 10px', height: '60px', borderBottom: '1px solid #ccc' }}>
      
      {/* Logo */}
      <Menu.Item style={{ padding: '0 15px' }}>
        <Image src="/logo.png" alt="eRaspored" style={{ height: '50px', width: 'auto' }} />
      </Menu.Item>

      {/* User Icon */}
      <Menu.Menu position="right">
        <Dropdown
          item
          icon={null}
          trigger={<Icon name="user circle" color="teal" size="big" />}
          pointing="top right"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              text="Profile"
              icon="user"
              onClick={() => console.log('Navigate to profile')}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              text="Logout"
              icon="sign-out"
              onClick={onLogout}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
      
    </Menu>
  );
};

Header.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Header;
