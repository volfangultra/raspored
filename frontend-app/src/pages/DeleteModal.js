import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import axios from 'axios';

const DeleteModal = ({ open, onClose,header, deleteItem, refreshData}) => {

  const deleteHandle = async () => {
    let url;
    switch (header) {
    case 'Dodavanje osoblja':
      url = `${process.env.REACT_APP_API_URL}/professors`;
      break;
    case 'Dodavanje prostorije':
      url = `${process.env.REACT_APP_API_URL}/classrooms`;
      break;
    case 'Dodavanje predmeta':
      url = `${process.env.REACT_APP_API_URL}/courses`;//TODO:Promjeniti da ide na sifranik courses
      break;
    default:
      console.error('Unknown header:', header);
      return;
    }
    
    try {     
      await axios.delete(`${url}/${deleteItem.id}`,deleteItem);
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <Modal size="small" open={open} onClose={onClose}>
      <Modal.Header>Potvrda brisanja</Modal.Header>
      <Modal.Content>
        <p>Jeste li sigurni da želite obrisati ovu stavku?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={onClose}>
            Ne
        </Button>
        <Button positive onClick={deleteHandle}>
            Da
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  deleteItem:PropTypes.object,
  refreshData:PropTypes.func,
};

export default DeleteModal;