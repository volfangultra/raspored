import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Grid, Dropdown, Button, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';
import AddModal from './AddModal';

const CourseForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState({
    id: editItem?.id || '',
    scheduleId: localStorage.getItem('scheduleId'),
    name: editItem?.name || '',
    lectureSlotLength: editItem?.lectureSlotLength || '',
    type: editItem?.type || '',
    professorId: editItem?.professorId || null,
    groupTakesCourses: editItem?.groupTakesCourses?.map((groupCourse) => ({
      studentGroupId: groupCourse.studentGroupId,
    })) || [],
    courseCanNotUseClassrooms: editItem?.courseCanNotUseClassrooms?.map((groupCourse) => ({
      classroomId: groupCourse.classroomId,
    })) || [],
  });

  const [professors, setProfessors] = useState([]);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [availableStudentGroups, setAvailableStudentGroups] = useState([]);
  const [selectedStudentGroups, setSelectedStudentGroups] = useState([]);
  const error = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const scheduleId = localStorage.getItem('scheduleId');
        const professorResponse = await axios.get(`${process.env.REACT_APP_API_URL}/professors`, {
          params: { scheduleId },
        });
        setProfessors(professorResponse.data);

        const studentGroupResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/student-groups?scheduleId=${localStorage.getItem('scheduleId')}`
        );
        const studentData = await studentGroupResponse.json();

        const studentGroupOptions = studentData.map((group) => ({
          key: group.id,
          text: group.name,
          value: group.id,
        }));

        const selectedGroupsMapped =
          editItem?.groupTakesCourses?.map((groupCourse) =>
            studentGroupOptions.find((option) => option.value === groupCourse.studentGroupId)
          ).filter(Boolean) || [];

        setSelectedStudentGroups(selectedGroupsMapped);

        setAvailableStudentGroups(
          studentGroupOptions.filter(
            (group) => !selectedGroupsMapped.some((selected) => selected.value === group.value)
          )
        );

        const classroomResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/classrooms?scheduleId=${localStorage.getItem('scheduleId')}`
        );
        const data = await classroomResponse.json();
        const options = data.map((classroom) => ({
          key: classroom.id,
          text: classroom.name,
          value: classroom.id,
        }));

        const selectedClassroomsMapped =
          editItem?.courseCanNotUseClassrooms?.map((groupCourse) =>
            options.find((option) => option.value === groupCourse.classroomId)
          ).filter(Boolean) || [];

        setSelectedClassrooms(selectedClassroomsMapped);

        setAvailableClassrooms(
          options.filter(
            (classroom) =>
              !selectedClassroomsMapped.some((selected) => selected.value === classroom.value)
          )
        );
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);


  const handleInputChange = (e, { name, value }) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    onChange(updatedForm);
  };

  const addClassroom = (e, { value }) => {
    const classroom = availableClassrooms.find((c) => c.value === value);
    if (classroom) {
      const updatedCourses = [...selectedClassrooms, classroom];
      setSelectedClassrooms(updatedCourses);

      setAvailableClassrooms(availableClassrooms.filter((c) => c.value !== value));

      const updatedcourseCanNotUseClassrooms = [
        ...formData.courseCanNotUseClassrooms,
        { classroomId: classroom.value },
      ];
      const updatedFormData = { ...formData, courseCanNotUseClassrooms: updatedcourseCanNotUseClassrooms };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const deleteClassroom = (classroomId) => {
    const updatedClassrooms = selectedClassrooms.filter((c) => c.value !== classroomId);
    const removedClassroom = selectedClassrooms.find((c) => c.value === classroomId);
    if (removedClassroom) {
      setSelectedClassrooms(updatedClassrooms);
      setAvailableClassrooms([...availableClassrooms, removedClassroom]);

      const updatedcourseCanNotUseClassrooms = formData.courseCanNotUseClassrooms.filter(
        (c) => c.classroomId !== classroomId
      );
      const updatedFormData = { ...formData, courseCanNotUseClassrooms: updatedcourseCanNotUseClassrooms };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const addStudentGroup = (e, { value }) => {
    const group = availableStudentGroups.find((g) => g.value === value);
    if (group) {
      const updatedGroups = [...selectedStudentGroups, group];
      setSelectedStudentGroups(updatedGroups);

      setAvailableStudentGroups(availableStudentGroups.filter((g) => g.value !== value));

      const updatedGroupTakesCourses = [
        ...formData.groupTakesCourses,
        { studentGroupId: group.value },
      ];
      const updatedFormData = { ...formData, groupTakesCourses: updatedGroupTakesCourses };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const deleteStudentGroup = (groupId) => {
    const updatedGroups = selectedStudentGroups.filter((g) => g.value !== groupId);
    const removedGroup = selectedStudentGroups.find((g) => g.value === groupId);
    if (removedGroup) {
      setSelectedStudentGroups(updatedGroups);
      setAvailableStudentGroups([...availableStudentGroups, removedGroup]);

      const updatedGroupTakesCourses = formData.groupTakesCourses.filter(
        (g) => g.studentGroupId !== groupId
      );
      const updatedFormData = { ...formData, groupTakesCourses: updatedGroupTakesCourses };

      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const courseTypeOptions = [
    { key: 'P', text: 'P', value: 'P' },
    { key: 'AV', text: 'AV', value: 'AV' },
    { key: 'LV', text: 'LV', value: 'LV' },
  ];

  return (
    <Form widths="equal">
      <Grid>
        {/* Basic Course Info */}
        <Grid.Row columns={3}>
          <Grid.Column>
            <Form.Input
              label="Naziv kursa"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              label="Dužina predavanja (broj časova)"
              name="lectureSlotLength"
              value={formData.lectureSlotLength}
              onChange={handleInputChange}
              type="number"
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Dropdown
              label="Tip časova"
              selection
              options={courseTypeOptions}
              value={formData.type}
              onChange={handleInputChange}
              name="type"
              forceSelection={false}
              selectOnBlur={false}
            />
          </Grid.Column>
        </Grid.Row>

        {/* Professor Selection */}
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Field>
              <label>Predavač</label>
              <Form.Dropdown
                fluid
                selection
                name="professorId"
                options={professors.map((prof) => ({
                  key: prof.id,
                  text: prof.name,
                  value: prof.id,
                }))}
                value={formData.professorId || null}
                onChange={(e, { value }) => {
                  const updatedFormData = { ...formData, professorId: value };
                  setFormData(updatedFormData);
                  onChange(updatedFormData);
                }}
                error={error ? true : false}
                forceSelection={false}
                selectOnBlur={false}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <Button
                color="teal"
                icon
                labelPosition="top"
                content="Add Professor"
                onClick={() => setModalOpen(true)}
                style={{ marginTop: '20px'}}
              >
                <Icon name="add" />
                Dodaj novog predavača
              </Button>
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Dropdown
              placeholder="Odaberite studentsku grupu"
              fluid
              search
              selection
              options={availableStudentGroups}
              onChange={addStudentGroup}
              forceSelection={false}
              selectOnBlur={false}
              value={null}
            />
            <Header as="h4">Odabrane studentske grupe:</Header>
            {selectedStudentGroups.length > 0 ? (
              <Segment
              style={{
                maxHeight: '100px',
                overflowY: 'auto',
                padding: '10px',
                marginTop: '10px',
              }}>
                {selectedStudentGroups.map((group, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span>{group.text}</span>
                    <Icon
                      name="delete"
                      color="red"
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => deleteStudentGroup(group.value)}
                    />
                  </div>
                ))}
              </Segment>
            ) : (
              <p>No selected student groups</p>
            )}
          </Grid.Column>

          <Grid.Column>
            <Dropdown
              placeholder="Exclude Classrooms"
              fluid
              search
              selection
              options={availableClassrooms}
              onChange={addClassroom}
              forceSelection={false}
              selectOnBlur={false}
              value={null}
            />
            <Header as="h4">Odabrane prostorije:</Header>
            {selectedClassrooms.length > 0 ? (
              <Segment
              style={{
                maxHeight: '100px',
                overflowY: 'auto',
                padding: '10px',
                marginTop: '10px',
              }}>
                {selectedClassrooms.map((classroom, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span>{classroom.text}</span>
                    <Icon
                      name="delete"
                      color="red"
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => deleteClassroom(classroom.value)}
                    />
                  </div>
                ))}
              </Segment>
            ) : (
              <p>Nema odabranih prostorija</p>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        header="Dodavanje osoblja"
        editItem={null}
        refreshData={() =>
          axios
            .get(`${process.env.REACT_APP_API_URL}/professors?scheduleId=${localStorage.getItem('scheduleId')}`)
            .then((response) => setProfessors(response.data))
            .catch((error) => console.error('Error fetching professors:', error))
        }
        showToast={null}
      />
    </Form>
  );
};

CourseForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  editItem: PropTypes.object,
};

export default CourseForm;
