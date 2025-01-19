import React, { useState, useEffect } from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const content = [[]];


  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/professors?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setTeachers(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
  
  useEffect(() => {
    fetchProfessors();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={teachers} header='Dodavanje osoblja' refreshData={fetchProfessors} />
      <ScheduleTable content={content} />
    </div>
  );
};

export default Teachers;
