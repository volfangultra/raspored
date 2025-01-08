import React, {useState, useEffect} from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/courses?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const content = [
    [],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={courses} buttonName='Dodaj predmet' header='Dodavanje predmeta' refreshData={fetchCourses}/>
      <ScheduleTable content={content} />
    </div>
  );
};

export default Courses;
