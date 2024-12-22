import React, { useState, useEffect } from 'react';
import { Header, Grid, Statistic, Segment, Divider } from 'semantic-ui-react';

const StatisticsSection = () => {
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, user is not authenticated.');
    }
    return token;
  };
      
  const [userCount, setUserCount] = useState(0);
  const [schedulesCount, setSchedulesCount] = useState(0);
    
  const fetchUserCount = async () => {
    try {
      const token = getToken();
    
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserCount(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
    
  const fetchSchedulesCount = async () => {
    try {
      const token = getToken();
    
      const response = await fetch(`${process.env.REACT_APP_API_URL}/studygroups/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSchedulesCount(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
    
  useEffect(() => {
    fetchUserCount();
    fetchSchedulesCount();
  }, []);

  return (
    <Grid.Row>
      <Grid.Column width={16}>
        <Segment>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Header as="h2" textAlign="center">
                    Pregled statistike
            </Header>
          </div>
          <Divider />
          <Statistic.Group widths="2" size="large">
            <Statistic>
              <Statistic.Value>{userCount}</Statistic.Value>
              <Statistic.Label>Korisnika</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>{schedulesCount}</Statistic.Value>
              <Statistic.Label>Kreiranih rasporeda</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  );

};

export default StatisticsSection;