import React,{useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import TeacherForm from './TeacherForm';
import ClassroomForm from './ClassroomForm';
import CourseForm from './CourseForm';
import axios from 'axios';

const AddModal = ({ open, onClose, header, editItem, refreshData}) => {
  const [formData, setFormData] = useState({});

  const getFormContent = (header) => {
    switch (header) {
    case 'Dodavanje osoblja':
      return <TeacherForm onChange={setFormData} editItem={editItem}/>;
    case 'Dodavanje prostorije':
      return <ClassroomForm onChange={setFormData} editItem={editItem}/>;
    case 'Dodavanje predmeta':
      return <CourseForm onChange={setFormData}/>;
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
        url = `${process.env.REACT_APP_API_URL}/courses`;//TODO:Promjeniti da ide na sifranik courses
        break;
      default:
        console.error('Unknown header:', header);
        return;
    }

    try {
      if(!editItem){
        const {id, ...formDataWithoutId} = formData;
        console.log(formData);
        await axios.post(url, formDataWithoutId);
      }
      else{       
        await axios.put(`${url}/${formData.id}`,formData)
      }
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
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
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};

export default AddModal;