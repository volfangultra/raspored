import React, { useState, useEffect } from 'react';
import { Container, Button, Input, Segment, Form, Grid, Header, Loader } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setUsername('');
    setPassword('');
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
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (isLoggingOut) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Loader active size="large" inline="centered">
          Logging out...
        </Loader>
      </div>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      {token ? (
        <Router>
          <Layout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/raspored" element={<MainPage />} />
            </Routes>
          </Layout>
        </Router>
      ) : (
        <Segment>
          <Header as="h2" textAlign="center">Login</Header>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Input
                    fluid
                    placeholder="Enter username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    fluid
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Button
                    color='teal'
                    fluid
                    onClick={handleLogin}
                  >
                    Log in
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Segment>
      )}
    </Container>
  );
}

export default App;
