import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon } from 'semantic-ui-react';

const TeacherForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState(() => {
    const [firstName = '', lastName = ''] = (editItem?.name || '').split(' ');
    return {
      id: editItem?.id || null,
      firstName: firstName,
      lastName: lastName,
      Rank: editItem?.rank || '',
      ScheduleId: localStorage.getItem('scheduleId'),
      Name: editItem?.name || '',
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      professorUnavailabilities: restrictions,
    }));
    onChange({
      ...formData,
      professorUnavailabilities: restrictions,
    });
  }, [restrictions]);

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

  const formatTimeForFront = (time) => time.split(':').slice(0, 2).join(':');
  const getDayName = (dayIndex) => ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'][dayIndex];
  const getDayIndex = (dayName) => ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'].indexOf(dayName);

  const addRestriction = () => {
    if (!formData.days || !formData.timeFrom || !formData.timeTo) return;
    const newRestriction = {
      day: getDayIndex(formData.days),
      startTime: `${formData.timeFrom}:00`,
      endTime: `${formData.timeTo}:00`,
    };
    setRestrictions((prev) => [...prev, newRestriction]);
    setFormData((prev) => ({ ...prev, days: '', timeFrom: '', timeTo: '' }));
  };

  const deleteRestriction = (index) => {
    setRestrictions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e, { name, value }) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
  
      if (name === 'firstName' || name === 'lastName') {
        updatedData.Name = `${name === 'firstName' ? value : prev.firstName} ${
          name === 'lastName' ? value : prev.lastName
        }`.trim();
      }
  
      return updatedData;
    });
    onChange((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
  
      if (name === 'firstName' || name === 'lastName') {
        updatedData.Name = `${name === 'firstName' ? value : prev.firstName} ${
          name === 'lastName' ? value : prev.lastName
        }`.trim();
      }
  
      return updatedData;
    });
    //console.log(`${formData.lastName}`);
  };
  console.log(formData)
  return (
    <>
      <Form widths="equal">
        <Form.Group>
          <Form.Input label="Ime" name="firstName" value={formData.firstName} onChange={handleInputChange} />
          <Form.Input label="Prezime" name="lastName" value={formData.lastName} onChange={handleInputChange} />
          <Form.Dropdown
            label="Zvanje"
            name="Rank"
            value={formData.Rank}
            onChange={handleInputChange}
            options={titleOptions}
            selection
            placeholder="Odaberi zvanje"
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
            placeholder="Odaberi dan"
          />
          <Form.Dropdown
            required
            label="Od"
            name="timeFrom"
            value={formData.timeFrom}
            onChange={handleInputChange}
            options={Array.from({ length: 24 }, (_, i) => ({
              key: i,
              value: `${i.toString().padStart(2, '0')}:00`,
              text: `${i.toString().padStart(2, '0')}:00`,
            }))}
            selection
            placeholder="Odaberi vrijeme"
          />
          <Form.Dropdown
            required
            label="Do"
            name="timeTo"
            value={formData.timeTo}
            onChange={handleInputChange}
            options={Array.from({ length: 24 }, (_, i) => ({
              key: i,
              value: `${i.toString().padStart(2, '0')}:00`,
              text: `${i.toString().padStart(2, '0')}:00`,
            }))}
            selection
            placeholder="Odaberi vrijeme"
          />
          <Icon name="check" color="teal" onClick={addRestriction} style={{ cursor: 'pointer', marginTop: '30px' }} />
        </Form.Group>
      </Form>

      <Header as="h4">Zabrane:</Header>
      {restrictions.length > 0 ? (
        <Segment style={{ maxHeight: '100px', overflowY: 'auto' }}>
          {restrictions.map((restriction, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span>
                {getDayName(restriction.day)} ({formatTimeForFront(restriction.startTime)} -{' '}
                {formatTimeForFront(restriction.endTime)})
              </span>
              <Icon
                name="delete"
                color="red"
                onClick={() => deleteRestriction(index)}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
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
  onChange: PropTypes.func,
  editItem: PropTypes.object,
};

export default TeacherForm;
