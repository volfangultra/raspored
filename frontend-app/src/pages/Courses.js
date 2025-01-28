import React,  { useRef } from 'react';
import PropTypes from 'prop-types';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';
import {Button} from "semantic-ui-react"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Courses = ({colors, setColors, setContent, content, handleStudentGroupSelect, courses, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, allProfessors, allStudentGroups, professor, studentGroup, classroom, handleDragStart,handleDropNew,handleDragOver}) => {
  //const [droppedItem, setDroppedItem] = useState(null);


  const scheduleTableRef = useRef();
  function convertToASCII(str) {
    return str
      .normalize('NFD')             // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks
      .replace(/[^\x20-\x7E]/g, '');   // Remove non-ASCII printable characters (excluding control characters)
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setupPdf = async (pdf, header, isFirstPage = false) => {
    header = convertToASCII(header);
  
    // Add a new page only if it's not the first page
    if (!isFirstPage) {
      pdf.addPage();
    }
  
    // Add the custom header
    pdf.setFont("Arial");
    pdf.setFontSize(16);
    pdf.text(header, 10, 10);
  
    // Convert ScheduleTable to an image
    const tableElement = scheduleTableRef.current;
    const canvas = await html2canvas(tableElement);
    const imgData = canvas.toDataURL("image/png");
  
    // Add the table image to the PDF
    const imgWidth = 190; // Adjust width to fit the page
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
  };
  
  const exportToPDF = async () => {
    const pdf = new jsPDF();
  
    if (professor || classroom || studentGroup) {
      let header = "";
      if (professor) header = professor.name; // Custom header text
      if (classroom) header = classroom.name;
      if (studentGroup) header = studentGroup.name;
  
      // Only one page needed, no new page will be added
      await setupPdf(pdf, header, true); // Pass `true` for the first page
      pdf.save(`${header}.pdf`);
    } else {
      let isFirstPage = true;
  
      for (const p of allProfessors) {
        await handleProfessorSelect(p.id); // Trigger state update
        await sleep(20); // Give React time to re-render
        await setupPdf(pdf, p.name, isFirstPage); // Generate PDF
        isFirstPage = false; // After first page, add new pages for subsequent professors
      }
      await handleProfessorSelect(null); // Reset professor
  
      for (const c of allClassrooms) {
        await handleClassroomSelect(c.id); // Trigger state update
        await sleep(20); // Give React time to re-render
        await setupPdf(pdf, c.name, isFirstPage); // Generate PDF
        isFirstPage = false; // After first page, add new pages for subsequent classrooms
      }
      await handleClassroomSelect(null); // Reset classroom
  
      for (const g of allStudentGroups) {
        await handleStudentGroupSelect(g.id); // Trigger state update
        await sleep(20); // Give React time to re-render
        await setupPdf(pdf, g.name, isFirstPage); // Generate PDF
        isFirstPage = false; // After first page, add new pages for subsequent student groups
      }
      await handleStudentGroupSelect(null); // Reset student group
  
      pdf.save("Raspored.pdf");
    }
  };
  //Povuci sve lessons i popuniti u content sta se treba popunit

  const handleDrop = (updatedContent) => {
    setContent(updatedContent);
  };


  return (

    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button
          basic
          color="teal"
          onClick={exportToPDF}
          onMouseEnter={(e) => e.target.classList.remove('basic')}
          onMouseLeave={(e) => e.target.classList.add('basic')}
        >
          Preuzmi u PDF-u
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
        colors={colors}
        setColors={setColors}
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
        allStudentGroups={allStudentGroups}
        handleDragOver={handleDragOver}
      />
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
  allProfessors: PropTypes.object,
  handleDragOver: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDropNew: PropTypes.func,
  setColors: PropTypes.func,
  setContent: PropTypes.func,
  colors: PropTypes.object,
  content: PropTypes.object,
  allStudentGroups: PropTypes.object
};
export default Courses;
