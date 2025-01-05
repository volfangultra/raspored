import React, { useState } from 'react';
import { Button, Segment, Grid, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';  
import myImage from './Image1.png';
import axios from 'axios';
import {AddLesson, GetProfessors, GetClassrooms, GetCourses, GetStudentGroups, GetProfessorAvailableTimes} from '../components/Logic';

const HomePage = () => {
  const [isBasic, setIsBasic] = useState(true);  
  const navigate = useNavigate();  
  const schedules = ['Raspored1', 'Raspored2', 'Raspored3', 'Raspored4', 'Raspored5']; 

  
  const handleCreateSchedule = async () => {
    navigate('/raspored');  
    /*try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_schedule/${1}`);
      localStorage.setItem("schedule_data", JSON.stringify(response.data));
      console.log("Classrooms", GetClassrooms())
      console.log("Professors", GetProfessors())
      console.log("Courses", GetCourses())
      console.log("StudentGroups", GetStudentGroups())
      console.log("ProfessorAvailabilites", GetProfessorAvailableTimes(1))
      
      
    } catch (error) {
      console.error("Error fetching schedule:", error.response ? error.response.data : error.message);
    }*/
  };  

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <Image src={myImage} size="small" centered style={{ marginBottom: '20px' }} />

      <Button
        basic={isBasic} 
        color="teal"
        style={{
          marginBottom: '20px', 
          textAlign: 'left', 
          marginLeft: '20px',
          transition: 'all 0.3s ease', 
        }}
        onClick={handleCreateSchedule}  
        onMouseEnter={() => setIsBasic(false)}  
        onMouseLeave={() => setIsBasic(true)} 
      >
        Kreiraj novi raspored
      </Button>

    
      <Segment color="teal" style={{ padding: '20px', width: '70%', margin: '0 auto' }}>
        <Grid columns={5} divided style={{ textAlign: 'center' }}>
          <Grid.Row>
         
            {schedules.map((schedule, index) => (
              <Grid.Column key={index}>
                <Segment>{schedule}</Segment>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default HomePage;
