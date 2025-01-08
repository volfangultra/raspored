import React, { useState, useEffect } from 'react';
import { Button, Segment, Grid, Image, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';  
import myImage from './Image1.png';
const HomePage = () => {
  const [isBasic, setIsBasic] = useState(true);  
  const navigate = useNavigate();  
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!userId) {
        console.error('UserId not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedules/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching schedules: ${response.statusText}`);
        }

        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [userId]);

  const handleCreateSchedule = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'My Schedule',
          semester: 'Zimski',
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }

      const { id } = await response.json();
      localStorage.setItem('scheduleId', id);
      navigate(`/raspored`);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleScheduleClick = async(scheduleId) => {
    localStorage.setItem('scheduleId', scheduleId);
    navigate(`/raspored`);
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
        {loading ? (
          <p>Loading schedules...</p>
        ) : schedules.length > 0 ? (
          <Grid columns={5} divided style={{ textAlign: 'center' }}>
            <Grid.Row>
              {schedules.map((schedule, index) => (
                <Grid.Column key={index}>
                  <Segment 
                    onClick={() => handleScheduleClick(schedule.id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {schedule.name}
                  </Segment>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        ) : (
          <Message info>
            <Message.Header>Trenutno nema raspored</Message.Header>
            <p>Molim da kreirate raspored.</p>
          </Message>
        )}
      </Segment>
    </div>
  );
};

export default HomePage;
