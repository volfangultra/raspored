import React,  { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SmallTable from './SmallTable';
import ScheduleTable from './ScheduleTable';
import {Button} from "semantic-ui-react"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Courses = ({colors, setColors, setContent, content, handleStudentGroupSelect, courses, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, allProfessors, allStudentGroups, professor, studentGroup, classroom, handleDragStart,handleDropNew,handleDragOver}) => {
  //const [droppedItem, setDroppedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading overlay



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
    try {
      const pdf = new jsPDF();

      if (professor || classroom || studentGroup) {
        let header = professor?.name || classroom?.name || studentGroup?.name;
        await setupPdf(pdf, header, true);
        pdf.save(`${header}.pdf`);
      } else {
        setIsLoading(true);
        let isFirstPage = true;

        for (const p of allProfessors) {
          await handleProfessorSelect(p.id);
          await sleep(20);
          await setupPdf(pdf, p.name, isFirstPage);
          isFirstPage = false;
        }
        await handleProfessorSelect(null);

        for (const c of allClassrooms) {
          await handleClassroomSelect(c.id);
          await sleep(20);
          await setupPdf(pdf, c.name, isFirstPage);
          isFirstPage = false;
        }
        await handleClassroomSelect(null);

        for (const g of allStudentGroups) {
          await handleStudentGroupSelect(g.id);
          await sleep(20);
          await setupPdf(pdf, g.name, isFirstPage);
          isFirstPage = false;
        }
        await handleStudentGroupSelect(null);

        pdf.save("Raspored.pdf");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (updatedContent) => {
    setContent(updatedContent);
  };


  return (
    <div style={{ position: 'relative' }}>
    {isLoading && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
      Generating PDF...
    </div>
      <div
      style={{
        width: '50px',
        height: '50px',
        border: '6px solid rgba(255, 255, 255, 0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
    )}
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
