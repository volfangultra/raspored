import React, {useState,useEffect} from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';
import { getHeader } from '../components/Logic'

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
 
  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/classrooms?scheduleId=${localStorage.getItem('scheduleId')}`,{
                method:"GET",
                headers:getHeader()
              });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
     
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const content = [
    [],
  ];
 
  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={classrooms} buttonName='Dodaj prostoriju' header='Dodavanje prostorije' refreshData={fetchClassrooms}/>
      <ScheduleTable content={content} />
    </div>
  );
};

export default Classrooms;
