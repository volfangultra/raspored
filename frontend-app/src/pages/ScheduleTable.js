import React from 'react';
import { Table } from 'semantic-ui-react';

const ScheduleTable = ({ content }) => {

  const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
  const schedule = [
    '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
    '18:00', '18:30', '19:00'
  ];

  return (
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
        {schedule.map((time, index) => (
          <Table.Row key={index}>
            <Table.Cell style={{ fontSize: '14px', fontWeight: 'bold', backgroundColor: 'white' }}>
              {time}
            </Table.Cell>
            {days.map((_, colIndex) => (
              <Table.Cell key={colIndex}>{content[index] && content[index][colIndex]}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default ScheduleTable;
