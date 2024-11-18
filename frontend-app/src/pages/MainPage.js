import React, { useState } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import Teachers from './Teachers'; 
import Courses from './Courses'; 
import Classrooms from './Classrooms'; 

const MainPage = () => {
  const [activeSection, setActiveSection] = useState('teachers'); 

  const renderSection = () => {
    switch (activeSection) {
      case 'teachers':
        return <Teachers />;
      case 'courses':
        return <Courses />;
      case 'classrooms':
        return <Classrooms />;
      default:
        return null;
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Menu compact>
        <Menu.Item
          color='teal'
          name="Osoblje"
          active={activeSection === 'teachers'}
          onClick={() => setActiveSection('teachers')}
        />
        <Menu.Item
          color='teal'
          name="Predmeti"
          active={activeSection === 'courses'}
          onClick={() => setActiveSection('courses')}
        />
        <Menu.Item
          color='teal'
          name="Prostorije"
          active={activeSection === 'classrooms'}
          onClick={() => setActiveSection('classrooms')}
        />
      </Menu>

      <div style={{ marginTop: '20px' }}>{renderSection()}</div>
    </Container>
  );
};

export default MainPage;
