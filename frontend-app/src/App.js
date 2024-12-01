import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import LoaderComponent from './components/Loader';

function App() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = () => {
    setIsLoggingOut(true);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setTimeout(() => {
      window.location.reload();
    }, 100);
    window.location.pathname = '/';
  };

  if (isLoggingOut) {
    return <LoaderComponent message='Logging out...' />
  }

  return (
    <Container style={{ marginTop: '20px' }}>
        <Router>
          {token ? (
            <Layout onLogout={handleLogout}>
              <Routes>
                {userRole === 'user' &&
                  <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/raspored" element={<MainPage />} />
                  </>
                }
                {userRole === 'admin' &&
                  <>
                    <Route path="/" element={<h1 style={{ marginTop: '10px' }}>Hi Admin!</h1>} />
                  </>
                }
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              <Route path='/' element={<LoginPage setToken={setToken} setUserRole={setUserRole} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
          
        </Router>
    </Container>
  );
}

export default App;
