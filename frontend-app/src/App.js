import React, { useState } from 'react';
import { Container, Typography, Button, List, ListItem } from '@mui/material';

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to My Project 1234
      </Typography>
      <Button variant="contained" color="primary" onClick={getAllStudents}>
        Show All Students
      </Button>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>{student.name}</ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
