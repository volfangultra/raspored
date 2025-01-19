import React from 'react';
import PropTypes from 'prop-types';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Courses = ({courses}) => {

  const content = [
    [],
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={courses} header='Dodavanje predmeta'/>
      <ScheduleTable content={content} />
    </div>
  );
};

Courses.propTypes = {
  courses:PropTypes.object,
};

export default Courses;
