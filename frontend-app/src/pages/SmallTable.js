import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon, Input } from 'semantic-ui-react';
import AddModal from './AddModal';
import DeleteModal from './DeleteModal';

const SmallTable = ({ data, buttonName, header, refreshData }) => {
  const [isBasic, setIsBasic] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const openEditModal = (item) => {
    setEditItem(item);
    setOpenAddModal(true);
  };

  const closeAddModal = () => {
    setOpenAddModal(false);
    setEditItem(null);
  };

  const openDeleteModalFunc = (item) => {
    setDeleteItem(item);
    setOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteItem(null);
    setOpenDeleteModal(false);
  };

  const displayItem = (element) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return element.name;
    case 'Dodavanje prostorije':
      return element.name;
    case 'Dodavanje predmeta':
      return element.name;
    case 'Dodavanje smijera':
      return element.name;
    default:
      console.error('Unknown header:', header);
      return null;
    }
  };

  const filteredData = data.filter((element) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '';
    case 'Dodavanje prostorije':
      return displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '';
    case 'Dodavanje predmeta':
      return displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '';
    case 'Dodavanje smijera':
      return displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '';
    default:
      console.error('Unknown header:', header);
      return false;
    }
  });

  return (
    <div style={{ paddingTop: '10px', minWidth: '25%', maxHeight: '800px'}}>
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
            <Table.HeaderCell colSpan='3'>
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
                  {displayItem(element)}
                </Table.Cell>
                <Table.Cell onClick={() => openEditModal(element)} width='1' style={{ textAlign: 'right', cursor: 'pointer' }}>
                  <Icon
                    name="ellipsis vertical"
                    color="teal"
                  />
                </Table.Cell>
                <Table.Cell onClick={() => openDeleteModalFunc(element)}  width='1' style={{ textAlign: 'right', cursor: 'pointer' }}>
                  <Icon 
                    name="trash alternate outline"
                    color="red"
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="3">Nema podataka za prikazati</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <AddModal open={openAddModal} onClose={closeAddModal} header={header} editItem={editItem} refreshData={refreshData}/>
      <DeleteModal open={openDeleteModal} onClose={closeDeleteModal} header={header} deleteItem={deleteItem} refreshData={refreshData}/>
    </div>
  );
};

SmallTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonName: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  refreshData:PropTypes.func,
};

export default SmallTable;