import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon } from 'semantic-ui-react';
import { getHeader } from '../components/Logic';

const ClassroomForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState(() => ({
    id: editItem?.id || null,
    Name: editItem?.name || '',
    Floor: editItem?.floor || '',
    Capacity: editItem?.capacity || '',
    ScheduleId: localStorage.getItem('scheduleId'),
    courseCanNotUseClassrooms: editItem?.courseCanNotUseClassrooms?.map((groupCourse) => ({
      courseId: groupCourse.courseId,
    })) || [],
  }));

  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/courses?scheduleId=${localStorage.getItem('scheduleId')}`,{
          method:"GET",
          headers:getHeader()
        }
      );
        const data = await response.json();

        const options = data.map((course) => ({
          key: course.id,
          text: course.name,
          value: course.id,
        }));

        const selectedCoursesMapped =
          editItem?.courseCanNotUseClassrooms?.map((groupCourse) =>
            options.find((option) => option.value === groupCourse.courseId)
          ).filter(Boolean) || [];

        setSelectedCourses(selectedCoursesMapped);

        setAvailableCourses(
          options.filter(
            (course) =>
              !selectedCoursesMapped.some((selected) => selected.value === course.value)
          )
        );
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [editItem]);

  const handleInputChange = (e, { name, value }) => {
    if ((name === 'Floor' || name === 'Capacity') && value < 0) {
      return;
    }
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    onChange(updatedForm);
  };

  const addCourse = (e, { value }) => {
    const course = availableCourses.find((c) => c.value === value);
    if (course) {
      const updatedCourses = [...selectedCourses, course];
      setSelectedCourses(updatedCourses);

      setAvailableCourses(availableCourses.filter((c) => c.value !== value));

      const updated = [
        ...formData.courseCanNotUseClassrooms,
        { courseId: course.value },
      ];
      const updatedFormData = { ...formData, courseCanNotUseClassrooms: updated };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const deleteCourse = (courseId) => {
    const updatedCourses = selectedCourses.filter((c) => c.value !== courseId);
    const removedCourse = selectedCourses.find((c) => c.value === courseId);
    if (removedCourse) {
      setSelectedCourses(updatedCourses);
      setAvailableCourses([...availableCourses, removedCourse]);

      const updated = formData.courseCanNotUseClassrooms.filter(
        (c) => c.courseId !== courseId
      );
      const updatedFormData = { ...formData, courseCanNotUseClassrooms: updated };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  return (
    <>
      <Form widths="equal">
        <Form.Group>
          <Form.Input
            label="Naziv učionice"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            placeholder="Unesite naziv učionice"
          />
          <Form.Input
            label="Sprat"
            name="Floor"
            type="number"
            min="1"
            value={formData.Floor}
            onChange={handleInputChange}
            placeholder="Unesite sprat učionice"
          />
          <Form.Input
            label="Kapacitet"
            name="Capacity"
            type="number"
            min="0"
            value={formData.Capacity}
            onChange={handleInputChange}
            placeholder="Unesite kapacitet učionice"
          />
        </Form.Group>
      </Form>

      <Header as="h4">  Dodajte predmete koji nisu mogući</Header>
      <Form widths="equal">
        <Form.Dropdown
          placeholder="Odaberite predmet"
          fluid
          search
          selection
          options={availableCourses}
          onChange={addCourse}
          clearable
          forceSelection={false}
          selectOnBlur={false}
          value={null}
        />
      </Form>

      <Header as="h4">Odabrani predmeti:</Header>
      {selectedCourses.length > 0 ? (
        <Segment
          style={{
            maxHeight: '100px',
            overflowY: 'auto',
            padding: '10px',
            marginTop: '10px',
          }}
        >
          {selectedCourses.map((course, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{course.text}</span>
              <Icon
                name="delete"
                color="red"
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => deleteCourse(course.value)}
              />
            </div>
          ))}
        </Segment>
      ) : (
        <p>Nema odabranih predmeta</p>
      )}
    </>
  );
};

ClassroomForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  editItem: PropTypes.object,
};

export default ClassroomForm;
