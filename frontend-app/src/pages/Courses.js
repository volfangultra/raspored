import React from 'react';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Courses = () => {
  const courses = [
    'Predmet1', 'Predmet2', 'Predmet3', 'Predmet4', 'Predmet5',
    'Predmet6', 'Predmet7', 'Predmet8', 'Predmet9', 'Predmet10',
    'Predmet11', 'Predmet12', 'Predmet13', 'Predmet14', 'Predmet15',
    'Predmet16', 'Predmet17', 'Predmet18', 'Predmet19', 'Predmet20'
  ];

  const content = [
    ['Predmet1', 'Predmet2', 'Predmet3', 'Predmet4', 'Predmet5'],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={courses} buttonName='Dodaj predmet' header='Dodavanje predmeta' />
      <ScheduleTable content={content} />
    </div>
  );
};

export default Courses;
