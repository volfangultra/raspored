import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Icon } from 'semantic-ui-react';
import { getHeader } from '../components/Logic';

const StudentGroupForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState(() => ({
    id: editItem?.id || null,
    Name: editItem?.name || '',
    Major: editItem?.major || '',
    Year: editItem?.year || '',
    ScheduleId: localStorage.getItem('scheduleId'),
    GroupTakesCourses: editItem?.groupTakesCourses?.map((groupCourse) => ({
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
          editItem?.groupTakesCourses?.map((groupCourse) =>
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
  }, []);

  const handleInputChange = (e, { name, value }) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    onChange(updatedForm);
  };

  const addCourse = (e, { value }) => {
    const course = availableCourses.find((c) => c.value === value);
    if (course) {
      const updatedCourses = [...selectedCourses, course];
      setSelectedCourses(updatedCourses);

      const updatedAvailableCourses = availableCourses.filter((c) => c.value !== value);
      setAvailableCourses(updatedAvailableCourses);

      const updatedGroupTakesCourses = [
        ...formData.GroupTakesCourses,
        { courseId: course.value },
      ];
      const updatedFormData = { ...formData, GroupTakesCourses: updatedGroupTakesCourses };

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

      const updatedGroupTakesCourses = formData.GroupTakesCourses.filter(
        (c) => c.courseId !== courseId
      );
      const updatedFormData = { ...formData, GroupTakesCourses: updatedGroupTakesCourses };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  return (
    <>
      <Form widths="equal">
        <Form.Group>
          <Form.Input
            label="Naziv grupe"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            placeholder="Unesite naziv grupe"
          />
          <Form.Input
            label="Smjer"
            name="Major"
            value={formData.Major}
            onChange={handleInputChange}
            placeholder="Unesite smjer"
          />
          <Form.Input
            label="Godina"
            name="Year"
            type="number"
            value={formData.Year}
            onChange={handleInputChange}
            placeholder="Unesite godinu"
          />
        </Form.Group>
      </Form>

      <Header as="h4">Dodaj predmete</Header>
      <Form widths="equal">
        <Form.Dropdown
          placeholder="Odaberite predmet"
          fluid
          search
          selection
          options={availableCourses}
          onChange={addCourse}
          value={null}
          clearable
          forceSelection={false}
          selectOnBlur={false}
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
        }}>
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

StudentGroupForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  editItem: PropTypes.object,
};

export default StudentGroupForm;
