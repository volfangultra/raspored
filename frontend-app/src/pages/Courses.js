import React,  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';

const Courses = ({handleStudentGroupSelect, courses, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, professor, studentGroup, classroom}) => {
  const start_time = process.env.REACT_APP_START_TIME
  const end_time = process.env.REACT_APP_END_TIME
  const startHour = parseInt(start_time.split(":")[0]); // Extract the hour from the start_time
  const endHour = parseInt(end_time.split(":")[0]);     // Extract the hour from the end_time
  const [content, setContent] = useState(Array(endHour - startHour + 1).fill().map(() => Array(5).fill('')));

  const time_to_num = (time) => parseInt(time.split(":")[0])

  const time_to_index = (time) => time_to_num(time) - time_to_num(start_time)
  //Povuci sve lessons i popuniti u content sta se treba popunit
  const setupContent = async() => {
    let initContent = Array(endHour - startHour + 1).fill().map(() => Array(5).fill(''))
    const lessons = courses.filter(c=>c.lessons.length > 0).map(c => {return {...c, "startTime":c.lessons[0].startTime, "endTime":c.lessons[0].endTime, "lesson_id":c.lessons[0].id, "day":c.lessons[0].day}})
    let updatedContent = [...initContent]
    lessons.forEach(l => {
      updatedContent[time_to_index(l.startTime)][l.day] = l
      for(let i = 1; i < l.length; i++)
        updatedContent[time_to_index(l.startTime) + i][l.day] = "MERGED"
    })
    setContent(updatedContent)
  }

  
  useEffect(() => {
    if (courses && courses.length > 0) {
      setupContent();
    }
    }, [courses, professor, studentGroup, classroom]);

  const handleDrop = (updatedContent) => {
    setContent(updatedContent);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <SmallTable data={courses} header='Dodavanje predmeta'/>
      <ScheduleTable handleClassroomSelect={handleClassroomSelect} handleProfessorSelect={handleProfessorSelect} handleStudentGroupSelect={handleStudentGroupSelect} content={content} onDrop={handleDrop} professor={professor} studentGroup={studentGroup} classroom={classroom} allCourses={allCourses} allClassrooms={allClassrooms}/>
    </div>
  );
};

Courses.propTypes = {
  handleStudentGroupSelect: PropTypes.func.isRequired,
  handleProfessorSelect: PropTypes.func.isRequired,
  handleClassroomSelect: PropTypes.func.isRequired,
  allClassrooms: PropTypes.array.isRequired,
  allCourses: PropTypes.array.isRequired,
  professor: PropTypes.object,
  studentGroup: PropTypes.object,
  classroom: PropTypes.object,
  courses: PropTypes.object,
};
export default Courses;
