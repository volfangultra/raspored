import React, { useEffect, useState } from 'react';
import {
  Container,
  Input,
  Dropdown,
  Grid,
  Card,
  Button,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import AddModal from './AddModal';
import DeleteModal from './DeleteModal';
import ToastMessage from '../components/ToastMessage';
import {
  fetchSchedules,
  fetchCourses,
  fetchProfessors,
  fetchClassrooms,
  fetchStudentGroups,
} from '../services/apiServices';

const CoursesPage = () => {
  const header = 'Dodavanje predmeta';
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');
  const [filterProfessor, setFilterProfessor] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterSlotLength, setFilterSlotLength] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem('userId');

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });

    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const setData = async () => {
    try {
      const schedules = await fetchSchedules(userId);
      setScheduleOptions(schedules);
      console.log(schedules);
      const allCourses = [],
        allProfessors = [],
        allClassrooms = [],
        allStudentGroups = [];
      for (const schedule of schedules) {
        const coursesData = await fetchCourses(schedule.key);
        coursesData.forEach((course) => {
          allCourses.push({ ...course, scheduleId: schedule.key });
        });
        const professorsData = await fetchProfessors(schedule.key);
        professorsData.forEach((professor) => {
          allProfessors.push({ ...professor, scheduleId: schedule.key});
        });
        const classroomsData = await fetchClassrooms(schedule.key);
        const studentGroupsData = await fetchStudentGroups(schedule.key);
        allClassrooms.push(...classroomsData);
        allStudentGroups.push(...studentGroupsData);
      }
      setCourses(allCourses);
      setProfessors(allProfessors);
      setClassrooms(allClassrooms);
      setStudentGroups(allStudentGroups);
    } catch (error) {
      console.error('Failed to fetch schedules or classrooms:', error);
    }
  };

  useEffect(() => {
    setData();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    filterProfessor,
    filterType,
    filterSlotLength,
    selectedSchedule,
  ]);

  const sortOptions = [{ key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' }];

  const sortCourses = (courses) => {
    switch (sortOption) {
      case 'nameAsc':
        return courses.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const filteredCourses = sortCourses(
    courses.filter((course) => {
      if (
        searchText &&
        !course.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (filterProfessor && course.professorId !== filterProfessor) {
        return false;
      }
      if (filterType && course.type !== filterType) {
        return false;
      }
      if (filterSlotLength && course.lectureSlotLength !== filterSlotLength) {
        return false;
      }
      if (selectedSchedule && course.scheduleId !== selectedSchedule) {
        return false;
      }
      return true;
    })
  );

  const filteredProfessors = selectedSchedule
    ? professors.filter(
        (professor) => professor.scheduleId === selectedSchedule
      )
    : professors;

  const professorOptions = filteredProfessors.map((professor) => ({
    key: professor.id,
    value: professor.id,
    text: professor.name,
  }));

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePaginationChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handleEditClick = (course) => {
    setCurrentCourse(course);
    setOpenAddModal(true);
  };

  const handleDeleteClick = (course) => {
    setCurrentCourse(course);
    setOpenDeleteModal(true);
  };

  const closeModals = () => {
    setCurrentCourse(null);
    setOpenAddModal(false);
    setOpenDeleteModal(false);
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      {toast.visible && (
        <ToastMessage message={toast.message} type={toast.type} />
      )}
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <div style={{ marginBottom: '20px' }}>
              <Dropdown
                placeholder="Odaberite raspored za pregled kurseva"
                fluid
                selection
                options={scheduleOptions}
                onChange={(e, { value }) => {
                  setSelectedSchedule(value);
                  if (value) {
                    localStorage.setItem('scheduleId', value);
                  } else {
                    localStorage.removeItem('scheduleId');
                  }
                }}
                value={selectedSchedule}
                clearable
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Button
                basic
                color="teal"
                style={{
                  marginBottom: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.classList.remove('basic')}
                onMouseLeave={(e) => e.target.classList.add('basic')}
                onClick={() => setOpenAddModal(true)}
                fluid
                disabled={!selectedSchedule}
              >
                Dodaj novi kurs
                <Icon name="plus" style={{ marginLeft: '10px' }} />
              </Button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Input
                icon="search"
                placeholder="Pretraga..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                fluid
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4 className="ui dividing header">Sortiraj po</h4>
              <Dropdown
                fluid
                selection
                options={sortOptions}
                value={sortOption}
                onChange={(e, { value }) => setSortOption(value)}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4 className="ui dividing header">Filteri</h4>
              <Dropdown
                placeholder="Odaberite profesora"
                fluid
                selection
                options={professorOptions}
                value={filterProfessor}
                onChange={(e, { value }) => setFilterProfessor(value)}
                clearable
                style={{ marginBottom: '10px' }}
              />
              <Dropdown
                placeholder="Tip"
                fluid
                selection
                options={[
                  { key: 'P', value: 'P', text: 'Predavanje' },
                  { key: 'AV', value: 'AV', text: 'Auditorne vježbe' },
                  { key: 'LV', value: 'LV', text: 'Laboratorijske vježbe' },
                ]}
                value={filterType}
                onChange={(e, { value }) => setFilterType(value)}
                clearable
              />
              <Dropdown
                placeholder="Broj časova"
                fluid
                selection
                options={[
                  { key: 1, value: 1, text: '1 čas' },
                  { key: 2, value: 2, text: '2 časa' },
                  { key: 3, value: 3, text: '3 časa' },
                ]}
                value={filterSlotLength}
                onChange={(e, { value }) => setFilterSlotLength(value)}
                clearable
                style={{ marginTop: '10px' }}
              />
            </div>
          </Grid.Column>

          <Grid.Column width={12}>
            <Card.Group itemsPerRow={3}>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course) => (
                  <Card key={course.id}>
                    <Card.Content>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Card.Header>{course.name}</Card.Header>
                        <Icon
                          name="edit"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(course)}
                        />
                      </div>
                      <Card.Meta>
                        Profesor:{' '}
                        {filteredProfessors.find((prof) => prof.id === course.professorId)?.name || "Nepoznato"}
                      </Card.Meta>
                      <Card.Description>
                        Tip:{' '}
                        {course.type == 'P'
                          ? 'Predavanje'
                          : course.type == 'AV'
                            ? 'Auditorne vježbe'
                            : course.type == 'LV'
                              ? 'Laboratorijske vježbe'
                              : 'N/A'}{' '}
                        <br />
                        Broj časova: {course.lectureSlotLength || 'N/A'} 
                        <br /> <br />
                        Učionice:{' '}
                        {course.courseCanUseClassrooms.length > 0
                          ? course.courseCanUseClassrooms
                              .map(
                                (cc) =>
                                  classrooms.find((classroom) => classroom.id === cc.classroomId)
                                    ?.name || 'Nepoznato'
                              )
                              .join(', ')
                          : 'Nema dostupnih učionica'}
                        <br />
                        Studentske grupe:{' '} 
                        {course.groupTakesCourses.length > 0
                          ? course.groupTakesCourses
                              .map(
                                (sg) =>
                                  studentGroups.find((group) => group.id === sg.studentGroupId)
                                    ?.name || 'Nepoznato'
                              )
                              .join(', ')
                          : 'Nema studentskih grupa'}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        basic
                        color="red"
                        onClick={() => handleDeleteClick(course)}
                        onMouseEnter={(e) => e.target.classList.remove('basic')}
                        onMouseLeave={(e) => e.target.classList.add('basic')}
                      >
                        Obriši
                      </Button>
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <div className="ui message">Nema rezultata.</div>
              )}
            </Card.Group>
            <Pagination
              style={{ marginTop: '20px', textAlign: 'right' }}
              activePage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePaginationChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <AddModal
        open={openAddModal}
        onClose={closeModals}
        header={header}
        editItem={currentCourse}
        refreshData={setData}
        showToast={showToast}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={closeModals}
        header={header}
        deleteItem={currentCourse}
        refreshData={setData}
        showToast={showToast}
      />
    </Container>
  );
};

export default CoursesPage;
