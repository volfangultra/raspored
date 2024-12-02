import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon, Input } from 'semantic-ui-react';
import AddModal from './AddModal';
import TeacherForm from './TeacherForm';
import ClassroomForm from './ClassroomForm';
import CourseForm from './CourseForm';

const SmallTable = ({ data, buttonName, header, type }) => {
  const [isBasic, setIsBasic] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);

  const openEditModal = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const closeAddModal = () => {
    setOpenModal(false);
    setEditItem(null);
  };

  const filteredData = data.filter((element) =>
    element.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormComponent = () => {
    switch (type) {
    case 'teacher':
      return <TeacherForm onSave={closeAddModal} edit={editItem} />;
    case 'classroom':
      return <ClassroomForm onSave={closeAddModal} edit={editItem} />;
    case 'course':
      return <CourseForm onSave={closeAddModal} edit={editItem} />;
    default:
      return null;
    }
  };

  return (
    <div style={{ paddingTop: '10px', minWidth: '25%', maxHeight: '800px', overflowY: 'auto' }}>
      <Button
        basic={isBasic}
        color="teal"
        style={{
          marginBottom: '10px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={() => setIsBasic(false)}
        onMouseLeave={() => setIsBasic(true)}
        onClick={() => openEditModal(null)}
        fluid
      >
        {buttonName}
        <Icon name="plus" style={{ marginLeft: '10px' }} />
      </Button>

      <Table compact="very" style={{ textAlign: 'center' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='2'>
              <Input
                icon="search"
                placeholder="Pretraga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '90%' }}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredData.length > 0 ? (
            filteredData.map((element, index) => (
              <Table.Row key={index}>
                <Table.Cell style={{ textAlign: 'left' }}>
                  {element}
                </Table.Cell>
                <Table.Cell onClick={() => openEditModal(element)} width='1' style={{ textAlign: 'right', cursor: 'pointer' }}>
                  <Icon
                    name="ellipsis vertical"
                    color="teal"
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="2">Nema podataka za prikazati</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <AddModal open={openModal} onClose={closeAddModal} header={header}>
        {getFormComponent()}
      </AddModal>
    </div>
  );
};

SmallTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonName: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['teacher', 'classroom', 'course']).isRequired,
};

export default SmallTable;