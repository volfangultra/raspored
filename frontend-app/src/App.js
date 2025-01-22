import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import LoaderComponent from './components/Loader';
import AdminHomePage from './pages/Admin/AdminHomePage';
import ClassroomsPage from './pages/ClassroomsPage';
import CoursesPage from './pages/CoursesPage';
import ProfessorsPage from './pages/ProfessorsPage';
import StudentGroupsPage from './pages/StudentGroupsPage';

function App() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');
    console.log(userId);
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
    }
    setIsLoading(false);
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

  if (isLoading) {
    return <LoaderComponent message='Loading...' />;
  }

  if (isLoggingOut) {
    return <LoaderComponent message='Logging out...' />;
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
                  <Route path="/ucionice" element={<ClassroomsPage />} />
                  <Route path="/kursevi" element={<CoursesPage />} />
                  <Route path="/osoblje" element={<ProfessorsPage />} />
                  <Route path="/smjerovi" element={<StudentGroupsPage />} />
                </>
              }
              {userRole === 'admin' &&
                <>
                  <Route path="/" element={<AdminHomePage />} />
                </>
              }
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path='/' element={<LoginPage setToken={setToken} setUserRole={setUserRole} setUserId={setUserId} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}    
      </Router>
    </Container>
  );
}

export default App;