import React from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Teachers = () => {
  const teachers = [
    'Osoba1', 'Osoba2', 'Osoba3', 'Osoba4', 'Osoba5'
  ];

  const content = [
    [],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={teachers} buttonName='Dodaj osoblje' header='Dodavnje osoblja' />
      <ScheduleTable content={content} />
    </div>
  );
};

export default Teachers;
