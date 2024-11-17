import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, Input, Box, Stack } from '@mui/material';

function App() {
  const [students, setStudents] = useState([]);

  const getAllStudents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Login i logout
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, PasswordHash: password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      setToken(data.token);
      setUserRole(data.role);
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      console.log('Login successful, token saved:', data.token, data.role);   
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const handleLogout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const fetchProtectedData = async (endpoint) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 403) {
        console.error('Access forbidden: insufficient privileges');
        return;
      }
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      console.log('Protected data:', data);
      alert(`Data from ${endpoint}: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to My Project
      </Typography>
      <Button variant="contained" color="primary" onClick={getAllStudents}>
        Show All Students
      </Button>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>{student.name}</ListItem>
        ))}
      </List>
      {token ? (
        <Box m={2} p={2}>
          <Typography variant="h5">
            Welcome {userRole === 'admin' ? 'Admin' : 'User'}!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchProtectedData(`${userRole}-data`)}
          >
          Fetch {userRole === 'admin' ? 'Admin' : 'User'} Data
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Log out
          </Button>
        </Box>
      ) : (
        <Box m={2} p={2}>
          <Stack direction="row" spacing={2}>
            <Input
              placeholder="Enter username or email"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Log in
            </Button>
          </Stack>
        </Box>
      )}

    </Container>
  );
}

export default App;
