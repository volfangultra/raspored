import React, { useState, useEffect } from 'react';
import { Container, Input, Icon, Dropdown, Button,Checkbox,Modal } from 'semantic-ui-react'; 
import Courses from './Courses';
import axios from 'axios';
import {testSpot} from "../components/Logic"

const MainPage = () => {
  const [scheduleName, setScheduleName] = useState('');
  const [semesterType, setSemesterType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [professorsOptions, setProfessorsOptions] = useState(null);
  const [studentGroupsOptions, setStudentGroupsOptions] = useState(null);
  const [classroomsOptions, setClassroomsOptions] = useState(null);
  const [courses, setCourses] = useState([]);

  const start_time = process.env.REACT_APP_START_TIME
  const end_time = process.env.REACT_APP_END_TIME
  const startHour = parseInt(start_time.split(":")[0]); // Extract the hour from the start_time
  const endHour = parseInt(end_time.split(":")[0]);     // Extract the hour from the end_time


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
  const [content, setContent] = useState(Array(endHour - startHour + 1).fill().map(() => Array(5).fill('')));
  const [colors, setColors] = useState(Array(endHour - startHour + 1).fill().map(() => Array(5).fill('#ffffff')))

  const resetColors = () => {
    let tempcolors = []
    for (let day = 0; day < 5; day++){
      let temp = []
      for (let hour = startHour; hour <= endHour; hour++) {
          temp.push('#ffffff')
      }
      tempcolors.push(temp)
    }
    setColors(tempcolors)
  }

  

  
  const time_to_num = (time) => parseInt(time.split(":")[0])

  const time_to_index = (time) => time_to_num(time) - time_to_num(start_time)


  const setupContent = async() => {
    console.log("Pozvano")
    let initContent = Array(endHour - startHour + 1).fill().map(() => Array(5).fill(''))
    let lessons = courses.filter(c=>c.lessons.length > 0).map(c => {return {...c, "startTime":c.lessons[0].startTime, "endTime":c.lessons[0].endTime, "lesson_id":c.lessons[0].id, "day":c.lessons[0].day}})
    if (selectedClassroom)
      lessons = lessons.filter((l) => l.lessons[0].classroomId == selectedClassroom.id)
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
      setupContent();
  }, [courses, selectedProfessor, selectedStudentGroup, selectedClassroom, colors]);


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
    console.log("USAO")
    console.log(professorId)
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
    /* OVO NE RADI
    setContent(Array(endHour - startHour + 1).fill().map(() => Array(5).fill('')))
    console.log(content)
    */
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
   try {
     await axios.delete(`${process.env.REACT_APP_API_URL}/schedules/${localStorage.getItem('scheduleId')}`);
     alert('Schedule deleted successfully');
   } catch (err) {
     console.error('Failed to delete schedule', err);
   }
  };

  const semesterOptions = [
    { key: 'zimski', text: 'Zimski', value: 'Zimski' },
    { key: 'ljetni', text: 'Ljetni', value: 'Ljetni' },
  ];

  const changeColor = (rowIndex, colIndex) => {
    let temp = [...colors]
    temp[colIndex][rowIndex] = "#FFC0CB"
    setColors(temp)
  }

  const handleDragStart = (event, item) => {
    console.log("START")
    for (let day = 0; day < 5; day++){
      for (let row = 0; row <= content.length; row++) {
        if (!testSpot(item, row, day, allCourses, classroomsOptions, professorsOptions, studentGroupsOptions, selectedProfessor, selectedClassroom, selectedStudentGroup, content)){
          changeColor(row, day)
        }
      }
    }
    event.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDropNew = () => {
    console.log("HEllo BITNAAAA STVAR")
    resetColors()
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
  style={{
    position: "absolute", // Absolute positioning relative to the container
    top: "60px", // Adjust based on your navbar height
    left: "0",
    right: "0",
    bottom: "40px", // Stretches the container to occupy the remaining viewport below the navbar
    //overflow: "auto",
    backgroundColor: "#f9f9f9",
    zIndex: 1, // Ensure the drag-and-drop section stays below the navbar
    display: "flex",
    flexDirection: "column",
    border: "1px solid lightgrey",
    padding: "10px"
  }}
  onDragOver={handleDragOver}
  onDrop={handleDropNew}
>
    <Container style={{ marginTop: '20px' }}>
          
      
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'start', marginTop: '10px' }}>
          <h2
            onClick={handleTitleClick}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '15px' }}
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
          </h2>

          <Dropdown
            selection
            options={semesterOptions}
            value={semesterType}
            onChange={handleSemesterChange}
            style={{display: 'inline-flex', alignItems: 'center', marginRight: '15px', marginLeft: '15px' }}
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
          >
            Dupliciraj raspored
          </Button>

        <Button
          basic
          color="red"
          onClick={handleDeleteSchedule}
        >
          Obriši raspored
        </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}><Courses colors={colors} setColors={setColors} content={content} setContent={setContent} handleClassroomSelect={handleClassroomSelect} handleProfessorSelect={handleProfessorSelect} handleStudentGroupSelect={handleStudentGroupSelect} courses={courses} professor={selectedProfessor} allProfessors={professorsOptions} allStudentGroups={studentGroupsOptions} classroom={selectedClassroom} studentGroup={selectedStudentGroup} allCourses={allCourses} allClassrooms={classroomsOptions} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDropNew={handleDropNew}/></div>
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
          <Button basic color= 'red' onClick={() => setIsDuplicateModalOpen(false)}>Odustani</Button>
          <Button basic color="teal" onClick={handleDuplicate}>
            Potvrdi
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
    </div>
  );
};

export default MainPage;
