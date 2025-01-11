import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Image, Dropdown } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    handleItemClick('', 'schedules');
    navigate('/');
  };

  const handleItemClick = (path, id) => {
    const items = document.querySelectorAll('.menu .item');
    items.forEach(item => {
      if (item.id === id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    navigate(`/${path}`);
  };

  return (
    <Menu fixed="top" style={{ backgroundColor: '#f5f5f5', padding: '0 10px', height: '60px', borderBottom: '1px solid #ccc' }}>

      {/* Logo */}
      <Menu.Item style={{ padding: '0 15px' }} onClick={handleLogoClick}>
        <Image src="/logo.png" alt="eRaspored" style={{ height: '50px', width: 'auto' }} />
      </Menu.Item>

      {/* Navigation Items */}
      <Menu.Item id="schedules" style={{ padding: '0 15px' }} onClick={() => handleItemClick('', 'schedules')}>
        Rasporedi
      </Menu.Item>
      <Menu.Item id="classrooms" style={{ padding: '0 15px' }} onClick={() => handleItemClick('ucionice', 'classrooms')}>
        Učionice
      </Menu.Item>
      <Menu.Item id="professors" style={{ padding: '0 15px' }} onClick={() => handleItemClick('profesori', 'professors')}>
        Profesori
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
              text="Profil"
              icon="user"
              onClick={() => console.log('Navigate to profile')}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              text="Odjava"
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
