import React,  { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';
import {Button} from "semantic-ui-react"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Courses = ({handleStudentGroupSelect, courses, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, allProfessors, professor, studentGroup, classroom}) => {
  const start_time = process.env.REACT_APP_START_TIME
  const end_time = process.env.REACT_APP_END_TIME
  const startHour = parseInt(start_time.split(":")[0]); // Extract the hour from the start_time
  const endHour = parseInt(end_time.split(":")[0]);     // Extract the hour from the end_time
  const [content, setContent] = useState(Array(endHour - startHour + 1).fill().map(() => Array(5).fill('')));
  //const [droppedItem, setDroppedItem] = useState(null);


  const scheduleTableRef = useRef();
  function convertToASCII(str) {
    return str
      .normalize('NFD')             // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks
      .replace(/[^\x20-\x7E]/g, '');   // Remove non-ASCII printable characters (excluding control characters)
  }

  const exportToPDF = async () => {
    const pdf = new jsPDF();
    let header = "Raspored"
    if(professor)
      header = professor.name; // Custom header text
    if(classroom)
      header = classroom.name
    if(studentGroup)
      header = studentGroup.name
    
    header = convertToASCII(header)
    // Add the custom header
    pdf.setFont("Arial");  // Ensure using a font that supports Unicode characters
    pdf.setFontSize(16);
    pdf.text(header, 10, 10);  // Adjust text position as needed
  
    // Convert ScheduleTable to an image
    const tableElement = scheduleTableRef.current;
    const canvas = await html2canvas(tableElement);
    const imgData = canvas.toDataURL('image/png');
  
    // Add the table image to the PDF
    const imgWidth = 190;  // Adjust width to fit the page
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
  
    // Save the PDF with the appropriate header
    pdf.save(`${header}.pdf`);
  };

  const time_to_num = (time) => parseInt(time.split(":")[0])

  const time_to_index = (time) => time_to_num(time) - time_to_num(start_time)
  //Povuci sve lessons i popuniti u content sta se treba popunit
  const setupContent = async() => {
    let initContent = Array(endHour - startHour + 1).fill().map(() => Array(5).fill(''))
    let lessons = courses.filter(c=>c.lessons.length > 0).map(c => {return {...c, "startTime":c.lessons[0].startTime, "endTime":c.lessons[0].endTime, "lesson_id":c.lessons[0].id, "day":c.lessons[0].day}})
    if (classroom)
      lessons = lessons.filter((l) => l.lessons[0].classroomId == classroom.id)
    console.log("Selected", lessons)
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

  
  const handleDragStart = (event, item) => {
    console.log("START")
    event.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDropNew = (event) => {
    // event.preventDefault();
    // const data = event.dataTransfer.getData("application/json");
    // const droppedData = JSON.parse(data);
    console.log("Dropped item:", event);
    //setDroppedItem(droppedData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
        style={{
          display: 'flex',
          gap: '20px',
          flexDirection: 'column',
          border: '1px solid lightgrey',
          padding: '10px',
          backgroundColor: '#f9f9f9'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDropNew}
      >
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button
          basic
          color="teal"
          onClick={exportToPDF}
        >
          Export to pdf
        </Button>
        <SmallTable data={courses} header='Dodavanje predmeta' handleDragStart={handleDragStart} handleDrop={handleDropNew}/>
      </div>
      <div
        ref={scheduleTableRef}
        style={{
          flex: 1, 
          display: 'block',   
        }}
      >
      <ScheduleTable 
        handleClassroomSelect={handleClassroomSelect} 
        handleProfessorSelect={handleProfessorSelect} 
        handleStudentGroupSelect={handleStudentGroupSelect} 
        content={content} 
        onDrop={handleDrop} 
        professor={professor} 
        studentGroup={studentGroup} 
        classroom={classroom} 
        allCourses={allCourses} 
        allClassrooms={allClassrooms} 
        allProfessors={allProfessors}
      />
    </div>
    </div>
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
  allProfessors: PropTypes.object
};
export default Courses;
