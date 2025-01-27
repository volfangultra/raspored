import React, { useState, useEffect } from 'react';
import { Container, Input, Icon, Dropdown, Button, Checkbox, Modal } from 'semantic-ui-react'; 
import Courses from './Courses';
import DeleteModal from './DeleteModal';
import axios from 'axios';

const MainPage = () => {
  const header = 'Dodavanje rasporeda';
  const [scheduleName, setScheduleName] = useState('');
  const [semesterType, setSemesterType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [professorsOptions, setProfessorsOptions] = useState(null);
  const [studentGroupsOptions, setStudentGroupsOptions] = useState(null);
  const [classroomsOptions, setClassroomsOptions] = useState(null);
  const [courses, setCourses] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedStudentGroup, setSelectedStudentGroup] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateOptions, setDuplicateOptions] = useState({
    professors: false,
    studentGroups: false,
    courses: false,
    classrooms: false,
  });

  const closeModals = () => {
    setOpenDeleteModal(false);
  };

  "Array(endHour - startHour + 1).fill().map(() => Array(5).fill(''))"
  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`);
      const { name, semester } = response.data;
      setScheduleName(name);
      setSemesterType(semester);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/professors?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfessorsOptions(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/classrooms?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClassroomsOptions(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };

  const fetchStudentGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/student-groups?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudentGroupsOptions(data);
    } catch (error) {
      console.error('Failed to fetch student groups:', error);
    }
  };
  const clear_selected = async () => {
    setSelectedStudentGroup(null)
    setSelectedProfessor(null)
    setSelectedClassroom(null)
  }

  useEffect(() => {
    fetchSchedule();
    fetchProfessors();
    fetchClassrooms();
    fetchStudentGroups();
  }, []);
  
  const handleProfessorSelect = async (professorId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses?scheduleId=${localStorage.getItem('scheduleId')}`);
      const courses = response.data;
      setAllCourses(courses)
      const filteredCourses = courses.filter(course => course.professorId === professorId);
      setCourses(filteredCourses);
    } catch (err) {
      console.error('Failed to fetch courses for professor', err);
    }
    const professor = professorsOptions.find(professor => professor.id === professorId);
    clear_selected()
    setSelectedProfessor(professor)
  };

  const handleClassroomSelect = async (classroomId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses?scheduleId=${localStorage.getItem('scheduleId')}`);
      const courses = response.data;
      setAllCourses(courses)
      const filteredCourses = courses.filter(course => !course.courseCanNotUseClassrooms.some(ccc => ccc.classroomId === classroomId));
      setCourses(filteredCourses);
    } catch (err) {
      console.error('Failed to fetch courses for professor', err);
    }
    const classroom = classroomsOptions.find(classroom => classroom.id == classroomId)
    clear_selected()
    setSelectedClassroom(classroom)
  };

  const handleStudentGroupSelect = async (studentGroupId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses?scheduleId=${localStorage.getItem('scheduleId')}`);
      const courses = response.data;
      setAllCourses(courses)
      const filteredCourses = courses.filter(course => course.groupTakesCourses.some(gtc => gtc.studentGroupId === studentGroupId));
      setCourses(filteredCourses);
    } catch (err) {
      console.error('Failed to fetch courses for professor', err);
    }
    const studentGroup = studentGroupsOptions.find(studentGroup=>studentGroup.id == studentGroupId)
    clear_selected()
    setSelectedStudentGroup(studentGroup)
  };

  const handleSemesterChange = async (e, { value }) => {
    setSemesterType(value);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
        { Name:scheduleName,Semester: value, UserId: localStorage.getItem('userId') });
    } catch (err) {
      console.error('Failed to update semester', err);
    }
  };

  const clearDropdowns = () => {
    const dropdown1 = document.querySelector('.dropdown1 .clear');
    if(dropdown1){
      dropdown1.click(); // Clear the input
    }

    const dropdown2 = document.querySelector('.dropdown2 .clear');
    if(dropdown2){
      dropdown2.click(); // Clear the input
    }

    const dropdown3 = document.querySelector('.dropdown3 .clear');
    if(dropdown3){
      dropdown3.click(); // Clear the input
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setScheduleName(e.target.value);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
        { Name: scheduleName, Semester: semesterType, UserId: localStorage.getItem('userId') });
    } catch (err) {
      console.error('Failed to save schedule name', err);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`, 
          { Name: scheduleName, Semester: semesterType, UserId: localStorage.getItem('userId') });
      } catch (err) {
        console.error('Failed to save schedule name', err);
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/schedules/duplicate`, {
        scheduleId: localStorage.getItem('scheduleId'),
        duplicateOptions,
      }, 
      {
        headers: {
          Authorization: localStorage.getItem('userId'),
        },
      });
      alert('Timetable duplicated successfully!');
    } catch (err) {
      console.error('Failed to duplicate timetable', err);
      alert('Failed to duplicate timetable.');
    } finally {
      setIsDuplicateModalOpen(false);
    }
  };

  const handleDuplicateCheckboxChange = (option) => {
    setDuplicateOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleDeleteSchedule = async () => {
    setOpenDeleteModal(true);
    //setTimeout(() => navigate("/"), 500);
  //  try {
  //    await axios.delete(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`);
  //    alert('Schedule deleted successfully');
  //  } catch (err) {
  //    console.error('Failed to delete schedule', err);
   //}
  };

  const semesterOptions = [
    { key: 'zimski', text: 'Zimski', value: 'Zimski' },
    { key: 'ljetni', text: 'Ljetni', value: 'Ljetni' },
  ];

  return (
    <Container style={{ marginTop: '20px' }}>
      
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'start', marginTop: '10px' }}>
          <h3
            onClick={handleTitleClick}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '15px', fontSize: '20px' }}
          >
            {isEditing ? (
              <Input
                value={scheduleName}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <>
                {scheduleName}
                <Icon
                  name="edit"
                  style={{ marginLeft: '10px', cursor: 'pointer', width: '10px', height: '10px', display: 'inline-flex', alignItems: 'center' }}
                  onClick={handleTitleClick}
                />
              </>
            )}
          </h3>

          <Dropdown
            selection
            options={semesterOptions}
            value={semesterType}
            onChange={handleSemesterChange}
            style={{display: 'inline-flex', alignItems: 'center', marginRight: '15px', marginLeft: '15px', minWidth: '150px'}}  
          />
            
          <div 
           style={{display: 'inline-flex', alignItems: 'center', marginRight: '15px' }}
          >

          
          
          <Dropdown
            placeholder='Profesori'
            className='dropdown1'
            selection
            clearable
            options={professorsOptions ? professorsOptions.map(professor => ({ key: professor.id, text: professor.name, value: professor.id })) : []}
            onChange={(e, { value }) =>{ clearDropdowns(); handleProfessorSelect(value);}}
            style={{minWidth: '150px'}}
            forceSelection={false}
            selectOnBlur={false}
            />
            <Dropdown
            placeholder='Učionice'
            className='dropdown2'
            selection
            clearable
            options={classroomsOptions ? classroomsOptions.map(classroom => ({ key: classroom.id, text: classroom.name, value: classroom.id })) : []}
            onChange={(e, { value }) => {clearDropdowns(); handleClassroomSelect(value);}}
            style={{minWidth: '150px'}}
            forceSelection={false}
            selectOnBlur={false}
            />
            <Dropdown
            placeholder='Smjerovi'
            className='dropdown3'
            selection
            clearable
            options={studentGroupsOptions ? studentGroupsOptions.map(studentGroup => ({ key: studentGroup.id, text: studentGroup.name, value: studentGroup.id })) : []}
            onChange={(e, { value }) => {clearDropdowns(); handleStudentGroupSelect(value);}}
            style={{minWidth: '150px'}}
            forceSelection={false}
            selectOnBlur={false}
            />
        </div>
        <Button
            basic
            color="teal"
            onClick={() => setIsDuplicateModalOpen(true)}
            onMouseEnter={(e) => e.target.classList.remove('basic')}
            onMouseLeave={(e) => e.target.classList.add('basic')}
            style={{minWidth: '165px'}}
          >
            Dupliciraj raspored
          </Button>
        <Button
          basic
          color="red"
          onClick={handleDeleteSchedule}
          onMouseEnter={(e) => e.target.classList.remove('basic')}
          onMouseLeave={(e) => e.target.classList.add('basic')}
          style={{minWidth: '140px'}}
        >
          Obriši raspored
        </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}><Courses handleClassroomSelect={handleClassroomSelect} handleProfessorSelect={handleProfessorSelect} handleStudentGroupSelect={handleStudentGroupSelect} courses={courses} professor={selectedProfessor} classroom={selectedClassroom} studentGroup={selectedStudentGroup} allCourses={allCourses} allClassrooms={classroomsOptions} allProfessors={professorsOptions}/></div>
    {/* Duplicate Modal */}
    <Modal open={isDuplicateModalOpen} onClose={() => setIsDuplicateModalOpen(false)} size="tiny">
        <Modal.Header>Dupliciraj Raspored</Modal.Header>
        <Modal.Content>
          <p>Koje elemente želite da duplicirate?</p>
          <Checkbox
            label="Profesore"
            checked={duplicateOptions.professors}
            onChange={() => handleDuplicateCheckboxChange('professors')}
          />
          <br />
          <Checkbox
            label="Smjerove"
            checked={duplicateOptions.studentGroups}
            onChange={() => handleDuplicateCheckboxChange('studentGroups')}
          />
          <br />
          <Checkbox
            label="Predmete"
            checked={duplicateOptions.courses}
            onChange={() => handleDuplicateCheckboxChange('courses')}
          />
          <br />
          <Checkbox
            label="Učionice"
            checked={duplicateOptions.classrooms}
            onChange={() => handleDuplicateCheckboxChange('classrooms')}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button 
                basic 
                color= 'red' 
                onMouseEnter={(e) => e.target.classList.remove('basic')}
                onMouseLeave={(e) => e.target.classList.add('basic')} 
                onClick={() => setIsDuplicateModalOpen(false)}>
                Odustani
          </Button>
          <Button 
            basic 
            color="teal" 
            onClick={handleDuplicate}
            onMouseEnter={(e) => e.target.classList.remove('basic')}
            onMouseLeave={(e) => e.target.classList.add('basic')}>
            Potvrdi
          </Button>
        </Modal.Actions>
      </Modal>
      <DeleteModal
        open={openDeleteModal}
        onClose={closeModals}
        header={header} 
        deleteItem={{'id':localStorage.getItem('scheduleId')}}
        refreshData={()=>{}}
        showToast={showToast}
      />
    </Container>
  );
};

export default MainPage;
