import React, { useState, useEffect } from 'react';
import { Button, Segment, Grid, Image, Message } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';  
import myImage from './Image1.png';
import { getHeader } from '../components/Logic';
import ToastMessage from '../components/ToastMessage';
const HomePage = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(location.state);
  console.log("Ucitajem home page")
  const [isBasic, setIsBasic] = useState(true);  
  const navigate = useNavigate();  
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false); 
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  useEffect(() => {
    const fetchSchedules = async () => {
      if (!userId) {
        console.error('UserId not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedules/user/${userId}`,{
                  method:"GET",
                  headers:getHeader()
                });
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
        headers: getHeader(),
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
      navigate('/raspored');
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleScheduleClick = async(scheduleId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get_schedule/${scheduleId}`, {
        method: 'GET',
        headers:getHeader()
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }

      const result = await response.json();
      localStorage.setItem('schedule_data', result);
      localStorage.setItem('scheduleId',scheduleId)
      navigate('/raspored');
    } catch (error) {
      console.error('Error getting schedule:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      {showToast && (
        <ToastMessage message={'Raspored uspješno obrisan.'} type={'success'} />
      )}
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
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {schedule.name}
                  </Segment>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        ) : (
          <Message info>
            <Message.Header>Trenutno nema rasporeda</Message.Header>
            <p>Molim da kreirate raspored.</p>
          </Message>
        )}
      </Segment>
    </div>
  );
};

export default HomePage;
