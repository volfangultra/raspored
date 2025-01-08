import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Grid, Dropdown, Button, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';
import AddModal from './AddModal';

const CourseForm = ({ onChange, editItem }) => {
  const [formData, setFormData] = useState({
    id: editItem?.id || '',
    ScheduleId: localStorage.getItem('scheduleId'),
    Name: editItem?.name || '',
    LectureSlotLength: editItem?.lectureSlotLength || '',
    Type: editItem?.type || '',
    ProfessorId: editItem?.professorId || null,
    GroupTakesCourses: editItem?.groupTakesCourses?.map((groupCourse) => ({
      studentGroupId: groupCourse.studentGroupId,
    })) || [],
    CourseCanUseClassrooms: editItem?.courseCanUseClassrooms?.map((groupCourse) => ({
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
          editItem?.courseCanUseClassrooms?.map((groupCourse) =>
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

      const updatedCourseCanUseClassrooms = [
        ...formData.CourseCanUseClassrooms,
        { classroomId: classroom.value },
      ];
      const updatedFormData = { ...formData, CourseCanUseClassrooms: updatedCourseCanUseClassrooms };

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

      const updatedCourseCanUseClassrooms = formData.CourseCanUseClassrooms.filter(
        (c) => c.classroomId !== classroomId
      );
      const updatedFormData = { ...formData, CourseCanUseClassrooms: updatedCourseCanUseClassrooms };

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
        ...formData.GroupTakesCourses,
        { studentGroupId: group.value },
      ];
      const updatedFormData = { ...formData, GroupTakesCourses: updatedGroupTakesCourses };

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

      const updatedGroupTakesCourses = formData.GroupTakesCourses.filter(
        (g) => g.studentGroupId !== groupId
      );
      const updatedFormData = { ...formData, GroupTakesCourses: updatedGroupTakesCourses };

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
    <Form>
      <Grid>
        {/* Basic Course Info */}
        <Grid.Row columns={3}>
          <Grid.Column>
            <Form.Input
              label="Course Name"
              name="name"
              value={formData.Name}
              onChange={handleInputChange}
              placeholder="Enter course name"
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              label="Lecture Slot Length (hours)"
              name="lectureSlotLength"
              value={formData.LectureSlotLength}
              onChange={handleInputChange}
              placeholder="Enter lecture length"
              type="number"
            />
          </Grid.Column>
          <Grid.Column>
            <Dropdown
              label="Type"
              placeholder="Select course type"
              fluid
              selection
              options={courseTypeOptions}
              value={formData.Type}
              onChange={handleInputChange}
              name="type"
            />
          </Grid.Column>
        </Grid.Row>

        {/* Professor Selection */}
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Field>
              <label>Professor</label>
              <Dropdown
                placeholder="Select Professor"
                fluid
                selection
                options={professors.map((prof) => ({
                  key: prof.id,
                  text: prof.name,
                  value: prof.id,
                }))}
                value={formData.ProfessorId || null}
                onChange={(e, { value }) =>
                  setFormData((prev) => ({ ...prev, professorId: value }))
                }
                error={error ? true : false}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Button
              primary
              content="Add Professor"
              onClick={() => setModalOpen(true)}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Dropdown
              placeholder="Select Student Groups"
              fluid
              search
              selection
              options={availableStudentGroups}
              onChange={addStudentGroup}
            />
            <Header as="h4">Selected Student Groups:</Header>
            {selectedStudentGroups.length > 0 ? (
              <Segment>
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
            />
            <Header as="h4">Odabrane prostorije:</Header>
            {selectedClassrooms.length > 0 ? (
              <Segment>
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
              <p>Nema odabranih predmeta</p>
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
      />
    </Form>
  );
};

CourseForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  editItem: PropTypes.object,
};

export default CourseForm;
