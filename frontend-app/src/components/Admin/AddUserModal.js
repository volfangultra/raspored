import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, Message, Dropdown } from 'semantic-ui-react';

const facultyOptions = [
  { key: 'pmf', text: 'Prirodno-matematički', value: 'Prirodno-matematički' },
  { key: 'etf', text: 'Elektrotehnički', value: 'Elektrotehnički' },
  { key: 'ef', text: 'Ekonomski', value: 'Ekonomski' },
  { key: 'ff', text: 'Filozofski', value: 'Filozofski' },
  { key: 'ita', text: 'ItAcademy', value: 'ItAcademy' },
];

const AddUserModal = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faculty, setFaculty] = useState('');
  const [success, setSuccess] = useState(false);


  const handleSubmit = () => {
    setSuccess(true);

    // Hide the modal and reset form after showing the success message
    setTimeout(() => {
      setSuccess(false); // Hide success message
      onClose(); // Close the modal
      setUsername(''); // Reset username
      setPassword(''); // Reset password
      setFaculty('');
    }, 3000); // Message displayed for 3 seconds
  };


  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Kreiraj korisnika</Modal.Header>
      {success && (
        <Message
          success
          header="Korisnik uspješno kreiran"
          content="Novi korisnik je uspješno dodan u sistem."
        />
      )}
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Korisničko ime</label>
            <Input
              placeholder="Unesite username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Lozinka</label>
            <Input
              type="password"
              placeholder="Unesite šifru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Fakultet</label>
            <Dropdown
              placeholder="Odaberite fakultet"
              fluid
              selection
              options={facultyOptions}
              value={faculty}
              onChange={(e, { value }) => setFaculty(value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="teal" onClick={handleSubmit}>
          Kreiraj
        </Button>
        <Button color="teal" basic onClick={onClose}>Odustani</Button>

      </Modal.Actions>
    </Modal>
  );
};

// Define PropTypes
AddUserModal.propTypes = {
  open: PropTypes.bool.isRequired, // Ensure open is a required boolean
  onClose: PropTypes.func.isRequired, // Ensure onClose is a required function
};

export default AddUserModal;
