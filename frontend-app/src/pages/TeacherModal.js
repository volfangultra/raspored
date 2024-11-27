import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Segment, Header, Button, Icon } from 'semantic-ui-react';

const TeacherModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    days: '',
    timeFrom: '',
    timeTo: '',
  });

  const [restrictions, setRestrictions] = useState([]);  // Dodajemo stanje za zabrane

  const titleOptions = [
    { key: 'asistent', value: 'asistent', text: 'Asistent' },
    { key: 'visii-asistent', value: 'viši asistent', text: 'Viši asistent' },
    { key: 'docent', value: 'docent', text: 'Docent' },
    { key: 'redovni-prof', value: 'redovni prof', text: 'Redovni profesor' },
    { key: 'vanredni-prof', value: 'vanredni prof', text: 'Vanredni profesor' },
  ];

  const daysOptions = [
    { key: 'ponedjeljak', value: 'Ponedjeljak', text: 'Ponedjeljak' },
    { key: 'utorak', value: 'Utorak', text: 'Utorak' },
    { key: 'srijeda', value: 'Srijeda', text: 'Srijeda' },
    { key: 'cetvrtak', value: 'Četvrtak', text: 'Četvrtak' },
    { key: 'petak', value: 'Petak', text: 'Petak' },
  ];

  const handleInputChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const addRestriction = () => {
    // Dodavanje zabrane u listu
    setRestrictions([
      ...restrictions,
      {
        day: formData.days,
        from: formData.timeFrom,
        to: formData.timeTo,
      },
    ]);

    // Očistiti odgovarajuća polja u formi
    setFormData({
      ...formData,
      days: '',
      timeFrom: '',
      timeTo: '',
    });
  };

  const deleteRestriction = (index) => {
    // Brisanje zabrane sa određenim indeksom
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Dodavanje osoblja</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Form.Group>
            <Form.Input
              label="Ime"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Form.Input
              label="Prezime"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <Form.Dropdown
              label="Zvanje"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              options={titleOptions}
              selection
            />
          </Form.Group>
        </Form>

        <Header as="h4">Zabrana raspoređivanja</Header>
        <Form widths="equal">
          <Form.Group>
            <Form.Dropdown
              label="Dan u sedmici"
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              options={daysOptions}
              selection
            />
            <Form.Input
              label="Od"
              name="timeFrom"
              type="time"
              value={formData.timeFrom}
              onChange={handleInputChange}
            />
            <Form.Input
              label="Do"
              name="timeTo"
              type="time"
              value={formData.timeTo}
              onChange={handleInputChange}
            />
            <Button
              color="teal"
              size="small"
              onClick={addRestriction}
              style={{ marginTop: '30px', marginBottom: '30px' }}
            >
              Dodaj
            </Button>
          </Form.Group>
        </Form>

        <Header as="h4">Zabrane:</Header>
        <Segment style={{ width: '30%', marginLeft: '0', padding: '10px' }}>
          {restrictions.map((restriction, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span>
                {restriction.day} ({restriction.from}-{restriction.to})
              </span>
              <Icon
                name="delete"
                color="red"
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => deleteRestriction(index)}
              />
            </div>
          ))}
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="teal" onClick={() => console.log(formData)}>
          Sačuvaj
        </Button>
        <Button basic color="teal" onClick={onClose}>
          Odustani
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

TeacherModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired, 
};

export default TeacherModal;
