import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon } from 'semantic-ui-react';

const TeacherForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState(() => {
    const [firstName = '', lastName = ''] = (editItem?.name || '').split(' ');
    return {
      id: editItem?.id || null,
      firstName: firstName,
      lastName: lastName,
      Rank: editItem?.rank.toLowerCase() || '',
      ScheduleId: localStorage.getItem('scheduleId'),
    };
  });

  const [restrictions, setRestrictions] = useState(() => {
    if (editItem?.professorUnavailabilities) {
      return editItem.professorUnavailabilities.map((avail) => ({
        day: avail.day,
        startTime: avail.startTime,
        endTime: avail.endTime,
      }));
    }
    return [];
  });

  const titleOptions = [
    { key: 'asistent', value: 'Asistent', text: 'Asistent' },
    { key: 'visi-asistent', value: 'Viši asistent', text: 'Viši asistent' },
    { key: 'docent', value: 'Docent', text: 'Docent' },
    { key: 'vanredni-prof', value: 'Vanredni profesor', text: 'Vanredni profesor' },
    { key: 'redovni-prof', value: 'Redovni profesor', text: 'Redovni profesor' },
  ];

  const daysOptions = [
    { key: 0, value: 'Ponedjeljak', text: 'Ponedjeljak' },
    { key: 1, value: 'Utorak', text: 'Utorak' },
    { key: 2, value: 'Srijeda', text: 'Srijeda' },
    { key: 3, value: 'Četvrtak', text: 'Četvrtak' },
    { key: 4, value: 'Petak', text: 'Petak' },
  ];

  const formatTimeForFront = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getDayName = (dayIndex) => {
    const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
    return days[dayIndex];
  };

  const getDayIndex = (dayName) => {
    const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
    return days.indexOf(dayName); 
  };
  

  const timeOptions = Array.from({ length: 24 }, (_, hour) => ({
    key: `${hour}:00`,
    value: `${hour.toString().padStart(2, '0')}:00`,
    text: `${hour.toString().padStart(2, '0')}:00`,
  }));

  const handleInputChange = (e, { name, value }) => {
    const updatedForm = { ...formData, [name]: value };
    if (name === 'firstName' || name === 'lastName') {
      updatedForm.Name = `${updatedForm.firstName} ${updatedForm.lastName}`.trim();
    }
    setFormData(updatedForm);
    onChange(updatedForm);
  };

  const addRestriction = () => {
    const newRestriction = {
      day: getDayIndex(formData.days),
      startTime: `${formData.timeFrom}:00`,
      endTime: `${formData.timeTo}:00`,
    };
  
    const updatedRestrictions = [...restrictions, newRestriction];
    setRestrictions(updatedRestrictions);

    setFormData({
      ...formData,
      days: '',
      timeFrom: '',
      timeTo: '',
    });

    formData.professorUnavailabilities = updatedRestrictions;
  
    if (editItem) {
      editItem.professorUnavailabilities = updatedRestrictions;
      onChange(editItem);
    }
  };
  

  const deleteRestriction = (index) => {
    const updatedRestrictions = restrictions.filter((_, i) => i !== index);
    setRestrictions(updatedRestrictions);
  
    if (editItem) {
      editItem.professorUnavailabilities = updatedRestrictions;
      onChange(editItem);
    }
  };
  

  return (
    <>
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
            name="Rank"
            value={formData.Rank}
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
            required
            label="Dan u sedmici"
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            options={daysOptions}
            selection
          />
          <Form.Dropdown
            required
            label="Od"
            placeholder="Odaberi vrijeme"
            name="timeFrom"
            value={formData.timeFrom}
            onChange={(e, { value }) =>
              handleInputChange(e, { name: 'timeFrom', value })
            }
            options={timeOptions}
            selection
          />
          <Form.Dropdown
            required
            label="Do"
            placeholder="Odaberi vrijeme"
            name="timeTo"
            value={formData.timeTo}
            onChange={(e, { value }) =>
              handleInputChange(e, { name: 'timeTo', value })
            }
            options={timeOptions}
            selection
          />

          <Icon
            name="check"
            color="teal"
            size="large"
            onClick={addRestriction}
            style={{
              marginTop: '30px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          />
        </Form.Group>
      </Form>

      <Header as="h4">Zabrane:</Header>
      {restrictions.length > 0 ? (
        <Segment>
          {restrictions.map((restriction, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>
                {getDayName(restriction.day)}{' '}
                ({formatTimeForFront(restriction.startTime)} - {formatTimeForFront(restriction.endTime)})
              </span>
              <Icon
                name="delete"
                color="red"
                style={{
                  marginLeft: '10px',
                  marginBottom: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => deleteRestriction(index)}
              />
            </div>
          ))}
        </Segment>
      ) : (
        <p>Nema zabrana</p>
      )}
    </>
  );
};

TeacherForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  editItem: PropTypes.object,
};

export default TeacherForm;
