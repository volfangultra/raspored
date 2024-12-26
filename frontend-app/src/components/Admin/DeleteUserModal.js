import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Icon } from 'semantic-ui-react';

const DeleteConfirmationModal = ({ fetchUsers, open, onClose, userId, deleteName }) => {

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, user is not authenticated.');
    }
    return token;
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting user:', errorData.Message || response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data.Message);
    } catch (error) {
      console.error('Error:', error);
    }
    fetchUsers();
    onClose();
  };

  return (
    <>
      {/* Modal for confirmation */}
      <Modal size="small" open={open} onClose={onClose}>
        <Modal.Header>
          Potvrdi uklanjanje
        </Modal.Header>
        <Modal.Content>
          <p>
            Jeste li sigurni da želite ukloniti korisnika <strong>{deleteName}</strong>?
            Ovo se ne može poništiti.
          </p>
        </Modal.Content>
        <Modal.Actions>
          {/* Cancel button */}
          <Button onClick={onClose}>
            <Icon name="cancel" /> Nazad
          </Button>
          {/* Confirm button */}
          <Button color="red" onClick={handleDelete}>
            <Icon name="trash" /> Ukloni
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

DeleteConfirmationModal.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  open: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.int.isRequired,
  deleteName: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
