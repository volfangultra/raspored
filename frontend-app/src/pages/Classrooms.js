import React from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Classrooms = () => {
  const Classrooms = [
    'Prostorija1', 'Prostorija2', 'Prostorija3', 'Prostorija4', 'Prostorija5'
  ];

  const content = [
    [],
  ];
 
  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={Classrooms} buttonName='Dodaj prostoriju'/>
      <ScheduleTable content={content} />
    </div>
  );
};

export default Classrooms;
