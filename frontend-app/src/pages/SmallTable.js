import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon } from 'semantic-ui-react';
import TeacherModal from './TeacherModal';  // import modala

const SmallTable = ({ data, buttonName }) => {
  const [isBasic, setIsBasic] = useState(true);  

  const [openModal, setOpenModal] = useState(false); 

  const openTeacherModal = () => setOpenModal(true);

  const closeTeacherModal = () => setOpenModal(false);

  return (
    <div style={{ paddingTop: '10px', minWidth: '25%', maxHeight: '500px', overflowY: 'auto'}}>
      <Button
        basic={isBasic} 
        color="teal"
        style={{
          marginBottom: '10px', 
          transition: 'all 0.3s ease', 
        }} 
        onMouseEnter={() => setIsBasic(false)}  
        onMouseLeave={() => setIsBasic(true)} 
        onClick={openTeacherModal} 
        fluid >
        {buttonName}
        <Icon name="plus" style={{ marginLeft: '10px' }} />
      </Button>
      <Table celled compact="very" style={{ textAlign: 'center' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Predmeti</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((element, index) => (
            <Table.Row key={index}>
              <Table.Cell>{element}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <TeacherModal open={openModal} onClose={closeTeacherModal} />
    </div>
  );
};

SmallTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonName: PropTypes.string.isRequired,
};

export default SmallTable;
