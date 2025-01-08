import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  
import { Container, Button, Input, Segment, Form, Grid, Header, Message, Image } from 'semantic-ui-react';
import LoaderComponent from '../components/Loader';

const LoginPage = ( {setToken, setUserRole,setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, PasswordHash: password }),
      });

      if (response.status === 404) {
        setLoginMessage('Uneseni username ne postoji.');
      } else if (response.status === 400) {
        setLoginMessage('Netačna šifra.');
      } else if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUserRole(data.role);
        setUserId(data.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId',data.id);
        navigate('/');  
      } else {
        throw new Error('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggingIn) {
    return <LoaderComponent message="Logging in..." />;
  }

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <Image src="/logo.png" alt="eRaspored" size="medium" style={{ marginBottom: '20px' }} />

      <Segment style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
        <Header as="h2" style={{ marginBottom: '20px' }} textAlign="center">Prijavite se na eRaspored</Header>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Input
                  fluid
                  placeholder="Unesite username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ marginBottom: '5px' }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Input
                  fluid
                  placeholder="Unesite šifru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  style={{ marginBottom: '5px' }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Button
                  color='teal'
                  fluid
                  onClick={handleLogin}
                  style={{
                    marginTop: '5px',
                    fontSize: '16px'
                  }}
                >
                  Prijava
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
      {loginMessage.length > 0 &&   
        <Message negative style={{ width: '100%', maxWidth: '400px', marginTop: '10px' }}>
          {loginMessage}
        </Message>
      }
    </Container>
  );
};

LoginPage.propTypes = {
  setToken: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  setUserId:PropTypes.func.isRequired,
};

export default LoginPage;