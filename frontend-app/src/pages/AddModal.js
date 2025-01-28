import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import TeacherForm from './TeacherForm';
import ClassroomForm from './ClassroomForm';
import CourseForm from './CourseForm';
import StudentGroupForm from './StudentGroupForm';
import axios from 'axios';
import { getHeader } from '../components/Logic';


const AddModal = ({ open, onClose, header, editItem, refreshData, showToast}) => {
  axios.defaults.headers = {
    ...axios.defaults.headers,
    ...getHeader(),
  };
  const [formData, setFormData] = useState({});

  const getFormContent = (header) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return <TeacherForm onChange={setFormData} editItem={editItem}/>;
    case 'Dodavanje prostorije':
      return <ClassroomForm onChange={setFormData} editItem={editItem}/>;
    case 'Dodavanje predmeta':
      return <CourseForm onChange={setFormData} editItem={editItem}/>;
    case 'Dodavanje smjera':
      return <StudentGroupForm onChange={setFormData} editItem={editItem}/>;
    default:
      return <div>Dodavanje</div>;
    }
  };

  const handleSave = async () => {
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
    default:
      console.error('Unknown header:', header);
      return;
    }

    try {
      console.log(formData)
      if(!editItem){
        const formDataWithoutId = Object.fromEntries(
          Object.entries(formData).filter(([key]) => key !== 'id')
        );        
        await axios.post(url, formDataWithoutId);
      }
      else{       
        await axios.put(`${url}/${formData.id}`,formData);
      }
      
      if (showToast)
        showToast(editItem ? 'Stavka uspješno uređena!' : 'Stavka uspješno dodana!', 'success');
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      if (showToast)
        showToast('Došlo je do greške pri dodavanju stavke.', 'error');
      onClose();
    } finally {
      setFormData(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>{getFormContent(header)}</Modal.Content>
      <Modal.Actions>
        <Button color="teal" onClick={handleSave}>
          Sačuvaj
        </Button>
        <Button basic color="teal" onClick={onClose}>
          Odustani
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

AddModal.propTypes = {
  showToast: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  editItem: PropTypes.object,
  refreshData: PropTypes.func
};

export default AddModal;