import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';


function App() {


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

    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/raspored" element={<MainPage />} />
      </Routes>
    </Layout>
  </Router>


  );
}

export default App;
