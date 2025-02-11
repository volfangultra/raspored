import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Dropdown, Button } from 'semantic-ui-react';
import axios from 'axios';
import { getHeader } from '../components/Logic';


import {testSpot, getAvailableClassroomsForGroup, getAvailableClassroomsForProfessor, time_to_num, num_to_time} from "../components/Logic"

import { useState, useEffect} from 'react';

const ScheduleTable = ({colors, setColors, handleStudentGroupSelect, handleProfessorSelect, handleClassroomSelect, allClassrooms, allCourses, allProfessors, allStudentGroups, content, onDrop, professor, studentGroup, classroom, handleDragOver}) => {
  axios.defaults.headers = {
    ...axios.defaults.headers,
    ...getHeader(),
  };
  const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
  // slot je sat vremena


  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [schedule, setSchedule] = useState([])
  
  const start_time = process.env.REACT_APP_START_TIME
  const end_time = process.env.REACT_APP_END_TIME
  const startHour = time_to_num(start_time); // Extract the hour from the start_time
  const endHour = time_to_num(end_time);     // Extract the hour from the end_time



  useEffect(()=>{
    let tempSchedule = []
    
    for (let hour = startHour; hour <= endHour; hour++) {
      tempSchedule.push(`${hour}:00`);
    }
    setSchedule(tempSchedule)
  }, [professor])

  

  const changeColor = (rowIndex, colIndex) => {
    let temp = colors
    temp[colIndex][rowIndex] = "#FFC0CB"
    setColors(colors)
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

  

  const handleDragStart = async (event, rowIndex, colIndex) => {
    console.log(rowIndex,colIndex)
    const cellValue = content[rowIndex][colIndex];
    console.log("I am dragging", cellValue)
    if (!cellValue || cellValue === 'MERGED') {
      console.error('Ne može se povući prazna ćelija ili spajani red.');
      return;
    }

    let updatedContent = [...content]
    for (let i = 0; i < cellValue.lectureSlotLength; i++) {
      if (updatedContent[rowIndex + i]) {
        updatedContent[rowIndex + i][colIndex] = '';
      }
    }
    
    let item = {
      ...cellValue,
      fromRow: rowIndex,
      fromCol: colIndex,
    }
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify(item)
    );
    await removeLesson(cellValue.lessons[0].id)
    
    for (let day = 0; day < 5; day++){
      for (let row = 0; row <= content.length; row++) {
        if (!testSpot(item, row, day, allCourses, allClassrooms, allProfessors, allStudentGroups, professor, classroom, studentGroup, content)){
          changeColor(row, day)
        }
      }
    }
    
  };

  const handleDrop = async (event, rowIndex, colIndex) => {
    console.log("DROPPPED")
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

    if(colors[colIndex][rowIndex] == "#FFC0CB")
      return

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
  
  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

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
            forceSelection={false}
            selectOnBlur={false}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={() => setModalOpen(false)}>
            Otkaži
          </Button>
          <Button basic color="teal" onClick={handleModalSubmit} disabled={!selectedClassroom}>
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

        let mainCellValue = cellValue;
        let mainRowIndex = rowIndex;
        if (!isMainCell) {
          for (let i = rowIndex - 1; i >= 0; i--) {
            const potentialMainCell = content[i]?.[colIndex];
            if (potentialMainCell && potentialMainCell.lectureSlotLength && i + potentialMainCell.lectureSlotLength > rowIndex) {
              mainCellValue = potentialMainCell;
              mainRowIndex = i;
              break;
            }
          }
        }

        return isMainCell || mainRowIndex === rowIndex ? (
          <Table.Cell
            key={colIndex}
            rowSpan={isMainCell ? mainCellValue.lectureSlotLength : 1}
            draggable
            onDragStart={(event) => handleDragStart(event, mainRowIndex, colIndex)}
            onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
            onDragOver={handleDragOver}
            style={{
              minHeight: '50px',
              backgroundColor: mainCellValue ? '#a1d1d1' : colors[colIndex][rowIndex],
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            {mainCellValue && mainRowIndex === rowIndex
              ? `${mainCellValue.name} (${allClassrooms.find((c) => c.id === mainCellValue.lessons[0].classroomId).name})`
              : ''}
          </Table.Cell>
        ) : null;
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
  handleDragOver:PropTypes.func,
  setColors:PropTypes.func,
  colors: PropTypes.object,
  allStudentGroups: PropTypes.object
};

export default ScheduleTable;
