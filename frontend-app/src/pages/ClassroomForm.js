import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Checkbox } from 'semantic-ui-react';

const ClassroomForm = ({onChange,editItem}) => {
  console.log(editItem)
  const [formData, setFormData] = useState({
    id:editItem?.id || null,
    Name: editItem?.name || '',
    Capacity: editItem?.capacity || '',
    resources: {
      blackboard: false,
      smartboard: false,
      projector: false,
      computers: false,
      laboratory: false,
    },
  });

  const resourceList = [
    { key: 'blackboard', label: 'Tabla' },
    { key: 'smartboard', label: 'Pametna tabla' },
    { key: 'projector', label: 'Projektor' },
    { key: 'computers', label: 'Računari' },
    { key: 'laboratory', label: 'Laboratorij' },
  ];

  const handleInputChange = (e, { name, value }) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    onChange(updatedForm);
  };

  const handleCheckboxChange = (e, { name, checked }) => {
    setFormData({
      ...formData,
      resources: { ...formData.resources, [name]: checked },
    });
  };

  return (
    <>
      <Form>
      <Form.Group widths="equal">
        <Form.Input
          label="Broj učionice"
          name="Name"
          value={formData.Name}
          onChange={handleInputChange}
          placeholder="Unesite broj učionice"
        />
        <Form.Input
          label="Kapacitet"
          name="Capacity"
          value={formData.Capacity}
          onChange={handleInputChange}
          placeholder="Unesite kapacitet učionice"
        />
      </Form.Group>

        <Header as="h4">Resursi učionice</Header>
        <Segment>
          {resourceList.map((resource) => (
            <Form.Field key={resource.key}>
              <Checkbox
                label={resource.label}
                name={resource.key}
                checked={formData.resources[resource.key]}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
          ))}
        </Segment>


      </Form>
    </>
  );
};

ClassroomForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default ClassroomForm;
