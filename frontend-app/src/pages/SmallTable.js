import React, { useState } from 'react';
import PropTypes, { elementType } from 'prop-types';
import { Table, Input } from 'semantic-ui-react';

const SmallTable = ({ data, header }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleDragStart = (event, item) => {
    console.log("Currently dragging", JSON.stringify(item))
    event.dataTransfer.setData('application/json', JSON.stringify(item)); // Pošalji cijeli objekt

  };

  const displayItem = (element) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return element.name;
    case 'Dodavanje prostorije':
      return element.name;
    case 'Dodavanje predmeta':
      return element.name;
    case 'Dodavanje smjera':
      return element.name;
    default:
      console.error('Unknown header:', header);
      return null;
    }
  };

  
  const filteredData = data.filter((element) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return (displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '') && (element.lessons.length == 0);
    case 'Dodavanje prostorije':
      return (displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '') && (element.lessons.length == 0);
    case 'Dodavanje predmeta':
      return (displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '') && (element.lessons.length == 0);
    case 'Dodavanje smjera':
      return (displayItem(element).toLowerCase().includes(searchTerm.toLowerCase()) || '') && (element.lessons.length == 0);
    default:
      console.error('Unknown header:', header);
      return element.lessons.length == 0;
    }
  });

  return (
    <div style={{ paddingTop: '14px', minWidth: '25%', maxHeight: '800px'}}>
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
              <Table.Row  key={index}
                          draggable
                          onDragStart={(event) => handleDragStart(event, element)}
              >
                <Table.Cell style={{ textAlign: 'center' }}>
                  {displayItem(element)}
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