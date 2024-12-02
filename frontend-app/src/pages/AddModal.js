import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import TeacherForm from './TeacherForm';
import ClassroomForm from './ClassroomForm';
import CourseForm from './CourseForm';

const AddModal = ({ open, onClose, header }) => {

  const getFormContent = (header) => {
    switch (header) {
      case 'Dodavnje osoblja':
        return <TeacherForm />;
      case 'Dodavanje prostorije':
        return <ClassroomForm />;
      case 'Dodavanje predmeta':
        return <CourseForm />;
      default:
        return <div>Dodavanje</div>;
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>{getFormContent(header)}</Modal.Content>
      <Modal.Actions>
        <Button color="teal">
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