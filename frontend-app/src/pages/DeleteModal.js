import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import { getHeader } from '../components/Logic';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ open, onClose, header, deleteItem, refreshData, showToast}) => {
  axios.defaults.headers = {
    ...axios.defaults.headers,
    ...getHeader(),
  };
  const navigate = useNavigate(); 

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
      url = `${process.env.REACT_APP_API_URL}/courses`;
      break;
    case 'Dodavanje smjera':
      url = `${process.env.REACT_APP_API_URL}/student-groups`;
      break;
    case 'Dodavanje rasporeda':
      url = `${process.env.REACT_APP_API_URL}/schedules`;
      break;
    default:
      console.error('Unknown header:', header);
      return;
    }
    
    try {     
      await axios.delete(`${url}/${deleteItem.id}`,deleteItem);
      showToast('Stavka uspješno obrisana!', 'success');
      refreshData();
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Došlo je do greške pri brisanju stavke.', 'error');
    }
    onClose();
    if(header=="Dodavanje rasporeda"){
      setTimeout(() => navigate('/', {state: true}), 100);
      
    }
  };
  
  return (
    <Modal size="small" open={open} onClose={onClose}>
      <Modal.Header>Potvrda brisanja {deleteItem?.name || 'nepoznate stavke'}</Modal.Header>
      <Modal.Content>
        <p>Jeste li sigurni da želite obrisati ovu stavku?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button 
            basic 
            color="red" 
            onMouseEnter={(e) => e.target.classList.remove('basic')}
            onMouseLeave={(e) => e.target.classList.add('basic')}
            onClick={onClose}>
            Ne
        </Button>
        <Button 
            basic 
            color="teal"
            onMouseEnter={(e) => e.target.classList.remove('basic')}
            onMouseLeave={(e) => e.target.classList.add('basic')} 
            onClick={deleteHandle}>
            Da
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DeleteModal.propTypes = {
  showToast: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  deleteItem:PropTypes.object,
  refreshData:PropTypes.func,
};

export default DeleteModal;