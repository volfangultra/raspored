import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon} from 'semantic-ui-react';

const TeacherForm = ({onChange,editItem}) => {
  const [formData, setFormData] = useState(()=>{
    const [firstName = '', lastName = ''] = (editItem?.name || '').split(' ');
    return{
      id: editItem?.id || null,
      firstName: firstName,
      lastName:lastName,
      Rank: editItem?.rank.toLowerCase() || '',
    }
  });

  const [restrictions, setRestrictions] = useState([]);

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
    setRestrictions([
      ...restrictions,
      {
        day: formData.days,
        from: formData.timeFrom,
        to: formData.timeTo,
      },
    ]);
    setFormData({
      ...formData,
      days: '',
      timeFrom: '',
      timeTo: '',
    });
  };

  const deleteRestriction = (index) => {
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  /*const handleSubmit = () => {
    onSave({ ...formData, restrictions });
  };*/

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
            style={{ marginTop: '30px', marginLeft: '10px', cursor: 'pointer' }}
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
                {restriction.day} ({restriction.from}-{restriction.to})
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
};

export default TeacherForm;
