import React, { useState, useEffect } from 'react';
import { Menu, Container, Input, Icon, Dropdown, Button } from 'semantic-ui-react';
import Teachers from './Teachers'; 
import Courses from './Courses'; 
import Classrooms from './Classrooms'; 
import StudentGroup from './StudentGroup';
import axios from 'axios';

const MainPage = () => {
  const [activeSection, setActiveSection] = useState('teachers');
  const [scheduleName, setScheduleName] = useState('My Schedule');
  const [semesterType, setSemesterType] = useState('Zimski');
  const [isEditing, setIsEditing] = useState(false);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`);
      const { name, semester } = response.data;
      setScheduleName(name);
      setSemesterType(semester);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSemesterChange = async (e, { value }) => {
    setSemesterType(value);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
        { Name:scheduleName,Semester: value, UserId: localStorage.getItem('userId') });
    } catch (err) {
      console.error('Failed to update semester', err);
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setScheduleName(e.target.value);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
        { Name: scheduleName, Semester: semesterType, UserId: localStorage.getItem('userId') });
    } catch (err) {
      console.error('Failed to save schedule name', err);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
          { Name: scheduleName, Semester: semesterType, UserId: localStorage.getItem('userId') });
      } catch (err) {
        console.error('Failed to save schedule name', err);
      }
    }
  };

  const handleDeleteSchedule = async () => {
    // try {
    //   await axios.delete(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`);
    //   alert('Schedule deleted successfully');
    // } catch (err) {
    //   console.error('Failed to delete schedule', err);
    // }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'teachers':
        return <Teachers />;
      case 'courses':
        return <Courses />;
      case 'classrooms':
        return <Classrooms />;
      case 'studentGroup':
        return <StudentGroup />;
      default:
        return null;
    }
  };

  const semesterOptions = [
    { key: 'zimski', text: 'Zimski', value: 'Zimski' },
    { key: 'ljetni', text: 'Ljetni', value: 'Ljetni' },
  ];

  return (
    <Container style={{ marginTop: '20px' }}>
      <div style={{ alignItems: 'center' }}>
        <Menu compact>
          <Menu.Item
            color="teal"
            name="Osoblje"
            active={activeSection === 'teachers'}
            onClick={() => setActiveSection('teachers')}
          />
          <Menu.Item
            color="teal"
            name="Predmeti"
            active={activeSection === 'courses'}
            onClick={() => setActiveSection('courses')}
          />
          <Menu.Item
            color="teal"
            name="Prostorije"
            active={activeSection === 'classrooms'}
            onClick={() => setActiveSection('classrooms')}
          />
          <Menu.Item
            color="teal"
            name="Student Group"
            active={activeSection === 'studenGroup'}
            onClick={() => setActiveSection('studentGroup')}
          />
        </Menu>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <h2
            onClick={handleTitleClick}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '20px' }}
          >
            {isEditing ? (
              <Input
                value={scheduleName}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <>
                {scheduleName}
                <Icon
                  name="edit"
                  style={{ marginLeft: '10px', cursor: 'pointer' }}
                  onClick={handleTitleClick}
                />
              </>
            )}
          </h2>

          <Dropdown
            selection
            options={semesterOptions}
            value={semesterType}
            onChange={handleSemesterChange}
          />
        </div>

        <Button
          color="red"
          onClick={handleDeleteSchedule}
          style={{ marginTop: '10px' }}
        >
          Delete Schedule
        </Button>
      </div>

      <div style={{ marginTop: '20px' }}>{renderSection()}</div>
    </Container>
  );
};

export default MainPage;
