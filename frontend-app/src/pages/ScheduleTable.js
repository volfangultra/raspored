import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Dropdown, Button } from 'semantic-ui-react';
import axios from 'axios';

import { useState, useEffect} from 'react';

const ScheduleTable = ({handleStudentGroupSelect, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, allProfessors, content, onDrop, professor, studentGroup, classroom}) => {

  const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
  // slot je sat vremena
  const num_to_time = (num) => `${startHour + num}:00`

  const time_to_num = (time) => parseInt(time.split(":")[0])

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [schedule, setSchedule] = useState([])
  const [colors, setColors] = useState([])
  const start_time = process.env.REACT_APP_START_TIME
  const end_time = process.env.REACT_APP_END_TIME
  const startHour = time_to_num(start_time); // Extract the hour from the start_time
  const endHour = time_to_num(end_time);     // Extract the hour from the end_time

  const isConflict = (startTime, endTime, startIndex, endIndex) => {
    const startTemp = time_to_index(startTime)
    const endTemp = time_to_index(endTime)
    return (endTemp >= startIndex && endTemp <= endIndex) || (startTemp <= endIndex && startTemp >= startIndex) || (endIndex >= startTemp && endIndex <= endTemp) || (startIndex >= startTemp && startIndex <= endTemp)
  }

  useEffect(()=>{
    let tempSchedule = []
    
    for (let hour = startHour; hour <= endHour; hour++) {
      tempSchedule.push(`${hour}:00`);
    }
    resetColors()
    setSchedule(tempSchedule)
  }, [professor])

  const resetColors = () => {
    let tempcolors = []
    for (let day = 0; day < 5; day++){
      let temp = []
      for (let hour = startHour; hour <= endHour; hour++) {
          temp.push(" ")
      }
      tempcolors.push(temp)
    }
    setColors(tempcolors)
  }

  const changeColor = (rowIndex, colIndex) => {
    let temp = colors
    temp[colIndex][rowIndex] = "#FFC0CB"
    setColors(colors)
  }

  const testSpot = (item, rowIndex, colIndex) => {
    if(item)
      return true
    console.log("Checking", rowIndex, colIndex)
    console.log("Data we have")
    console.log("lesson", item)
    console.log("all courses", allCourses)
    console.log("all Classrooms", allClassrooms)
    console.log("all Professors", allProfessors)
    console.log("rowIndex", rowIndex)
    console.log("colIndex", colIndex)
    console.log("Professor", professor)
    console.log("Classroom", classroom)
    console.log("StudentGroup", studentGroup)
   
    // Provjeri ima li dovoljno prostora za predmet na novoj poziciji
    for (let i = 0; i < item.lectureSlotLength; i++)
      if (rowIndex + i >= content.length || content[rowIndex + i][colIndex]) {
        console.log("Ne moze stati")
        return false;
      }

    let classrooms = []
    if(professor)
      classrooms = getAvailableClassroomsForProfessor(allCourses, allClassrooms, item, rowIndex, colIndex)
    if(studentGroup)
      classrooms = getAvailableClassroomsForGroup(allCourses, allClassrooms, item, rowIndex, colIndex)
    if (classrooms.length == 0 && !classroom){
      console.log("Nema ucionica")
      return false
    }
    //samo ako se profesor selecta ovo radi
    let currentProfessorUnavailabilites = allProfessors.find((p)=> p.id == item.professorId).professorUnavailabilities.filter((a) => a.day == colIndex)
    if(currentProfessorUnavailabilites){
        console.log(currentProfessorUnavailabilites)
        let a = currentProfessorUnavailabilites.find((p) => isConflict(p.startTime, p.endTime, rowIndex, rowIndex + item.lectureSlotLength))
        console.log(a)
        if (a){
          console.log("Profi se poklapa")
          return false
        }
      }

    //Provjerait da li profa ne predaje nesto

    //Provjeriti da li grupa nema tada nesto
    
    console.log("Sve dure")
    return true
  }

  const updateContent = async () => {
    if (professor)
      await handleProfessorSelect(professor.id)
    if (classroom)
      await handleClassroomSelect(classroom.id)
    if(studentGroup)
      await handleStudentGroupSelect(studentGroup.id)

  }

  const addLesson = async (item, rowIndex, colIndex) => {
    const url = `${process.env.REACT_APP_API_URL}/lessons`
    const data = {
      "CourseId":item.id,
      "ClassroomId": selectedClassroom.id,
      "Day": colIndex,
      "StartTime": num_to_time(rowIndex),
      "EndTime": num_to_time(rowIndex + item.lectureSlotLength - 1)
    }
    const response = await axios.post(url, data);
    if (item.lessons.length == 0){
      item.lessons = [response.data]
    }
    else{
      item.lessons[0].id = item.lesson_id = response.data.id
      item.lessons[0].startTime = item.startTime = response.data.startTime
      item.lessons[0].endTime = item.endTime = response.data.endTime
      item.lessons[0].day = item.day = response.data.day
      item.lessons[0].classroomId = response.data.classroomId
    }
    item.startTime = response.data.endTime
    item.fromCol = colIndex
    item.fromRow = rowIndex
    await updateContent()
    return item
  }

  const removeLesson = async(id) => {
      const url = `${process.env.REACT_APP_API_URL}/lessons/${id}`
      await axios.delete(url);
      await updateContent()
  }

  const handleModalSubmit = async (a=null,b=null,c=null) => {
    // Postavi predmet na novu poziciju
    let updatedContent = [...content]
    
    let item = currentLesson[0]
    let rowIndex = currentLesson[1]
    let colIndex = currentLesson[2]
    if (a && b && c){
      item = a
      rowIndex = b
      colIndex = c
    }
    console.log("Tried to submit", item, rowIndex, colIndex)
    item = await addLesson(item, rowIndex, colIndex)

    for (let i = 0; i < item.lectureSlotLength; i++) {
      updatedContent[rowIndex + i][colIndex] = i === 0 ? item : 'MERGED';
    }
  
    onDrop(updatedContent);
    setModalOpen(false);
  };

  const time_to_index = (time) => time_to_num(time) - time_to_num(start_time)

  const handleDragStart = async (event, rowIndex, colIndex) => {
    const cellValue = content[rowIndex][colIndex];
    console.log("I am dragging", cellValue)
    if (!cellValue || cellValue === 'MERGED') {
      console.error('Ne može se povući prazna ćelija ili spajani red.');
      return;
    }

    //Remove the lesson on start
    let updatedContent = [...content]
    for (let i = 0; i < cellValue.lectureSlotLength; i++) {
      if (updatedContent[rowIndex + i]) {
        updatedContent[rowIndex + i][colIndex] = '';
      }
    }
    onDrop(updatedContent);
    let item = {
      ...cellValue,
      fromRow: rowIndex,
      fromCol: colIndex,
    }
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify(item)
    );
    
    for (let day = 0; day < 5; day++){
      for (let row = 0; row <= content.length; row++) {
        if (!testSpot(item, row, day)){
          changeColor(row, day)
        }
      }
    }
    await removeLesson(cellValue.lessons[0].id)
  };



  const getAvailableClassroomsForProfessor = (allCourses, allClassrooms, selectedCourse, rowIndex, colIndex)=>{

    let classroomIdsToRemove = selectedCourse.courseCanNotUseClassrooms.map((c)=>c.classroomId)

    let classroomIds = allClassrooms.map((c)=>c.id)

    let classroomIdsThatHaveLessons = allCourses.filter((c)=>c.lessons.length > 0 && c.lessons[0].day == colIndex && isConflict(c.lessons[0].startTime, c.lessons[0].endTime, rowIndex, rowIndex + selectedCourse.lectureSlotLength) && c.id != selectedCourse.id).map((c) => c.lessons[0].classroomId)

    classroomIdsToRemove = [... new Set([...classroomIdsToRemove, ...classroomIdsThatHaveLessons])]


    classroomIds = classroomIds.filter(x => !classroomIdsToRemove.includes(x));

    return allClassrooms.filter((c) => classroomIds.includes(c.id))
  }

  const getAvailableClassroomsForGroup = (allCourses, allClassrooms, selectedCourse, rowIndex, colIndex)=>{
    let classroomIds = allClassrooms.map((c)=>c.id)
    let classroomIdsToRemove = selectedCourse.courseCanNotUseClassrooms.map((c)=>c.classroomId)

    let classroomIdsThatHaveLessons = allCourses.filter((c)=>c.lessons.length > 0 && c.lessons[0].day == colIndex && isConflict(c.lessons[0].startTime, c.lessons[0].endTime, rowIndex, rowIndex + selectedCourse.lectureSlotLength) && c.id != selectedCourse.id).map((c) => c.lessons[0].classroomId)
    classroomIds = classroomIds.filter(x => (!classroomIdsThatHaveLessons.includes(x)) && (!classroomIdsToRemove.includes(x)));

    return allClassrooms.filter((c) => classroomIds.includes(c.id))

  }

  const handleDrop = async (event, rowIndex, colIndex) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');
  
    if (!data) {
      console.error('No data found for drag event.');
      return;
    }
  
    let item;
    try {
      item = JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse drag data:', error);
      return;
    }

    if (!item || !item.name || !item.lectureSlotLength) {
      console.error('Invalid item dropped.');
      return;
    }

    // Provjeri ima li dovoljno prostora za predmet na novoj poziciji
    for (let i = 0; i < item.lectureSlotLength; i++) {
      if (rowIndex + i >= content.length || content[rowIndex + i][colIndex]) {
        console.error('Nema dovoljno prostora za predmet na novoj poziciji.');
        return;
      }
    }

    await setCurrentLesson([item, rowIndex, colIndex])
    
    let classrooms = [classroom]
    if(professor)
      classrooms = getAvailableClassroomsForProfessor(allCourses, allClassrooms, item, rowIndex, colIndex)
    if(studentGroup)
      classrooms = getAvailableClassroomsForGroup(allCourses, allClassrooms, item, rowIndex, colIndex)
    if(!classroom){
      setClassroomOptions(classrooms)
      setModalOpen(true)
    }
    else{
      setSelectedClassroom(classroom)
      handleModalSubmit(item, rowIndex, colIndex)
    }
  

  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  

  return (
    <>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="small">
        <Modal.Header>Select a Classroom</Modal.Header>
        <Modal.Content>
          <Dropdown
            placeholder="Select Classroom"
            fluid
            selection
            options={classroomOptions.map((c) => ({
              key: c.id, // Unique key for each option
              value: c, // The value that will be returned when selected
              text: c.name, // The text displayed in the dropdown
            }))}
            onChange={(e, { value }) => setSelectedClassroom(value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={() => setModalOpen(false)}>
            Otkaži
          </Button>
          <Button basic color="teal" onClick={handleModalSubmit}>
            Postavi
          </Button>
        </Modal.Actions>
      </Modal>

    <Table color="teal" celled compact="very" style={{ textAlign: 'center' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ fontSize: '14px', fontWeight: 'bold' }} />
          {days.map((day, index) => (
            <Table.HeaderCell key={index}>
              {day}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
      {schedule.map((time, rowIndex) => (
  <Table.Row key={rowIndex}>
    <Table.Cell>{time}</Table.Cell>
    {days.map((_, colIndex) => {
      const cellValue = content[rowIndex] && content[rowIndex][colIndex];

      if (cellValue === 'MERGED') {
        return null;
      }

      const isMainCell = cellValue && typeof cellValue === 'object' && cellValue.lectureSlotLength;
      return (
        <Table.Cell
          key={colIndex}
          rowSpan={isMainCell ? cellValue.lectureSlotLength : 1}
          draggable
          onDragStart={isMainCell ? (event) => handleDragStart(event, rowIndex, colIndex) : null}
          onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
          onDragOver={handleDragOver}
          onDragEnd={isMainCell ? () => console.log("Drag Ended") : null} // Added dragEnd
          style={{
            minHeight: '50px',
            backgroundColor: cellValue ? '#a1d1d1' : colors[colIndex][rowIndex],
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {isMainCell ? cellValue.name : ''}
        </Table.Cell>
      );
    })}
  </Table.Row>
))}
      </Table.Body>
    </Table>
    </>
  );
};

ScheduleTable.propTypes = {
  handleStudentGroupSelect: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  handleProfessorSelect: PropTypes.func.isRequired,
  handleClassroomSelect: PropTypes.func.isRequired,
  allClassrooms: PropTypes.array.isRequired,
  allCourses: PropTypes.array.isRequired,
  professor: PropTypes.object,
  studentGroup: PropTypes.object,
  classroom: PropTypes.object,
  courses:PropTypes.object,
  content:PropTypes.object,
  allProfessors:PropTypes.object,
};

export default ScheduleTable;
