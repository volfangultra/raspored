import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon, Checkbox } from 'semantic-ui-react';

const CourseForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    courseName: '',
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
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, { name, checked }) => {
    setFormData({
      ...formData,
      resources: { ...formData.resources, [name]: checked },
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <>
      <Form>
        <Form.Input
          label="Naziv predmeta"
          name="courseName"
          value={formData.courseName}
          onChange={handleInputChange}
          placeholder="Unesite naziv predmeta"
          width={8}
        />

        <Header as="h4">Potrebni resursi</Header>
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

CourseForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default CourseForm;
