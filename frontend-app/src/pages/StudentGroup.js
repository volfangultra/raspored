import React, {useState,useEffect} from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';
import { getHeader } from '../components/Logic';

const StudentGroup = () => {
  const [studentGroups, setStudentGroups] = useState([]);
 
  const fetchStudentGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/student-groups?scheduleId=${localStorage.getItem('scheduleId')}`,{
                method:"GET",
                headers:getHeader()
              });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudentGroups(data);
    } catch (error) {
      console.error('Failed to fetch student group:', error);
    }
  };
     
  useEffect(() => {
    fetchStudentGroups();
  }, []);

  const content = [
    [],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={studentGroups} buttonName='Dodaj smjer' header='Dodavanje smjera' refreshData={fetchStudentGroups}/>
      <ScheduleTable content={content} />
    </div>
  );
};

export default StudentGroup;
