import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Dropdown, Button } from 'semantic-ui-react';
import axios from 'axios';

import { useState, useEffect} from 'react';

const ScheduleTable = ({handleStudentGroupSelect, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, content, onDrop, professor, studentGroup, classroom}) => {

  const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
  // slot je sat vremena
  const num_to_time = (num) => `${startHour + num}:00`

  const time_to_num = (time) => parseInt(time.split(":")[0])

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [schedule, setSchedule] = useState([])

  useEffect(()=>{
    let tempSchedule = []
    const start_time = process.env.REACT_APP_START_TIME
    const end_time = process.env.REACT_APP_END_TIME
    const startHour = time_to_num(start_time); // Extract the hour from the start_time
    const endHour = time_to_num(end_time);     // Extract the hour from the end_time
    for (let hour = startHour; hour <= endHour; hour++) {
      tempSchedule.push(`${hour}:00`);
    }
    setSchedule(tempSchedule)})

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
    console.log("Actualy submited", data)
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

  
  const start_time = process.env.REACT_APP_START_TIME
  const startHour = time_to_num(start_time); // Extract the hour from the start_timez

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
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        ...cellValue,
        fromRow: rowIndex,
        fromCol: colIndex,
      })
    );
    onDrop(updatedContent);
    await removeLesson(cellValue.lessons[0].id)
  };

  const isConflict = (startTime, endTime, startIndex, endIndex) => {
    const startTemp = time_to_index(startTime)
    const endTemp = time_to_index(endTime)
    return (endTemp >= startIndex && endTemp <= endIndex) || (startTemp <= endIndex && startTemp >= startIndex)

  }

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
          <Button negative onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button positive onClick={handleModalSubmit}>
            Submit
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
            backgroundColor: cellValue ? '#a1d1d1' : '',
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
};

export default ScheduleTable;
