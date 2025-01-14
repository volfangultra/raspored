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

const CoursesPage = () => {
  const header = 'Dodavanje predmeta';
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterProfessor, setFilterProfessor] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterSlotLength, setFilterSlotLength] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [currentCourse, setCurrentCourse] = useState(null);;
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [professors, setProfessors] = useState({});
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem('userId');

  const fetchCourses = async (scheduleId = null) => {
    try {
      const scheduleQuery = scheduleId ? `?scheduleId=${scheduleId}` : `?scheduleId=${localStorage.getItem('scheduleId')}`;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/courses${scheduleQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchSchedules = async () => {
    if (!userId) {
      console.error('UserId not found in localStorage');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/schedules/user/${userId}`);
      if (!response.ok) {
      throw new Error(`Error fetching schedules: ${response.statusText}`);
      }

      const data = await response.json();
      const options = data.map((schedule) => ({
        key: schedule.id,
        value: schedule.id,
        text: schedule.name,
      }));
      setScheduleOptions(options);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } 
  };

  const fetchProfessors = async () => {
    try {
      const scheduleId = localStorage.getItem('scheduleId');
      if (!scheduleId) {
        console.log('No scheduleId found in localStorage');
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/professors?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const professorMap = data.reduce((map, professor) => {
        map[professor.id] = professor.name;
        return map;
      }, {});
      setProfessors(professorMap);
      console.log(data);
      console.log(professorMap);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchProfessors();
  }, [selectedSchedule]);

  const applyFilters = () => {
    let filtered = [...courses];
    if (searchText) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterProfessor) {
      filtered = filtered.filter((course) => course.professorId == filterProfessor);
    }

    if (filterType) {
      filtered = filtered.filter((course) => course.type === filterType);
    }

    if (filterSlotLength) {
      filtered = filtered.filter((course) => course.lectureSlotLength === filterSlotLength);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, filterProfessor, filterType, filterSlotLength, courses]);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1); 
  };

  const handleFilterBySchedule = (e, { value }) => {
    setSelectedSchedule(value);
    setSearchText('');
    setFilterProfessor(null);
    setFilterSlotLength(null);
    setFilterType(null);
    localStorage.setItem('scheduleId', value);
    fetchCourses(value);
  };

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
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <div style={{ marginBottom: '20px' }}>
              <Dropdown
                placeholder="Odaberite raspored za pregled kurseva"
                fluid
                selection
                options={scheduleOptions}
                onChange={handleFilterBySchedule}
                value={selectedSchedule}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Button
                basic
                color='teal'
                style={{
                  marginBottom: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.classList.remove('basic')}
                onMouseLeave={(e) => e.target.classList.add('basic')}
                onClick={() => setOpenAddModal(true)}
                fluid
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
                onChange={handleSearch}
                fluid
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4 className="ui dividing header">Filteri</h4>
              <Dropdown
                placeholder="Odaberite profesora"
                fluid
                selection
                options={Object.entries(professors).map(([id, name]) => ({ key: id, value: id, text: name }))}
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
                      Profesor: {professors[course.professorId] || "Nepoznato"}
                    </Card.Meta>
                    <Card.Description>
                      Tip: {course.type == "P" ? "Predavanje" : 
                            course.type == "AV" ? "Auditorne vježbe" :
                            course.type == "LV" ? "Laboratorijske vježbe" : "N/A"} <br />
                      Broj časova: {course.lectureSlotLength || "N/A"} <br />
                      {course.courseCanUseClassrooms
                          .filter((cc) => cc.classroom_id === course.id)
                          .map(
                            (cc) =>
                              courses.find(
                                (course) => course.id === cc.course_id
                              )?.name
                          )
                          .join(', ') || 'Nema učionica'}
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
              <div className="ui message">
                Nema rezultata.
              </div>
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
        refreshData={fetchCourses}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={closeModals}
        header={header} 
        deleteItem={currentCourse}
        refreshData={fetchCourses}
      />
    </Container>
  );
}

export default CoursesPage;
