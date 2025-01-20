import React, { useState, useEffect } from 'react';
import {
  Container,
  Input,
  Dropdown,
  Grid,
  Card,
  Button,
  Modal,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import ScheduleTable from './ScheduleTable';
import AddModal from './AddModal';
import DeleteModal from './DeleteModal';
import { fetchSchedules, fetchClassrooms, fetchCourses } from '../services/apiServices';

const ClassroomsPage = () => {
  const header = 'Dodavanje prostorije';
  const floors = [1, 2, 3, 4];
  const userId = localStorage.getItem('userId');
  const [searchText, setSearchText] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };
  
  const setData = async () => {
    try {
      const schedules = await fetchSchedules(userId);
      setScheduleOptions(schedules);

      const allClassrooms = [], allCourses = [];
      for (const schedule of schedules) {
        const classroomsData = await fetchClassrooms(schedule.key);
        classroomsData.forEach((classroom) => {
          allClassrooms.push({ ...classroom, scheduleId: schedule.key });
        });
        
        const coursesData = await fetchCourses(schedule.key);
        allCourses.push(...coursesData);
      }
      setClassrooms(allClassrooms);
      setCourses(allCourses);
    } catch (error) {
      console.error('Failed to fetch schedules or classrooms:', error);
    }
  };
  useEffect(() => {
    setData();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchText, filterFloor, filterSize, selectedSchedule]);

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'sizeAsc', text: 'Broj mjesta (rast.)', value: 'sizeAsc' },
    { key: 'sizeDesc', text: 'Broj mjesta (opad.)', value: 'sizeDesc' },
  ];

  const sizeOptions = [
    { key: 'greater', text: 'Veći od 50', value: 'greater' },
    { key: 'smaller', text: 'Manji od 50', value: 'smaller' },
  ];
  
  const sortClassrooms = (classrooms) => {
    switch (sortOption) {
    case 'nameAsc':
      return classrooms.sort((a, b) => a.name.localeCompare(b.name));
    case 'sizeAsc':
      return classrooms.sort((a, b) => a.capacity - b.capacity);
    case 'sizeDesc':
      return classrooms.sort((a, b) => b.capacity - a.capacity);
    default:
      return classrooms;
    }
  };

  const filteredClassrooms = sortClassrooms(
    classrooms.filter((classroom) => {
      if (
        searchText &&
        !classroom.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (filterFloor && classroom.floor !== filterFloor) {
        return false;
      }
      if (filterSize === 'greater' && classroom.capacity <= 50) {
        return false;
      }
      if (filterSize === 'smaller' && classroom.capacity > 50) {
        return false;
      }
      if (selectedSchedule && classroom.scheduleId !== selectedSchedule) {
        return false;
      }
      return true;
    })
  );

  const handleEditClick = (classroom) => {
    setCurrentClassroom(classroom);
    setOpenAddModal(true);
  };

  const openScheduleModal = (classroom) => {
    setCurrentClassroom(classroom);
    setScheduleModalOpen(true);
  };

  const handleDeleteClick = (classroom) => {
    setCurrentClassroom(classroom);
    setOpenDeleteModal(true);
  };

  const closeModals = () => {
    setCurrentClassroom(null);
    setScheduleModalOpen(false);
    setOpenAddModal(false);
    setOpenDeleteModal(false);
  };

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredClassrooms.length / itemsPerPage);
  const paginatedClassrooms = filteredClassrooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePaginationChange = (e, { activePage }) =>
    setCurrentPage(activePage);

  return (
    <Container style={{ marginTop: '20px' }}>
      {toast.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: '50px',
            right: '20px',
            background: toast.type === 'success' ? '#21ba45' : '#db2828',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
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
                disabled={selectedSchedule ? false : true}
              >
                Dodaj novu učionicu
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
              <h4 className="ui dividing header">Filteri</h4>
              <Dropdown
                placeholder="Sprat"
                fluid
                selection
                options={floors.map((floor) => ({
                  key: floor,
                  text: `Sprat ${floor}`,
                  value: floor,
                }))}
                value={filterFloor}
                onChange={(e, { value }) => setFilterFloor(value)}
                clearable
              />
              <Dropdown
                placeholder="Veličina"
                fluid
                selection
                options={sizeOptions}
                value={filterSize}
                onChange={(e, { value }) => setFilterSize(value)}
                clearable
                style={{ marginTop: '10px' }}
              />
            </div>

            <div>
              <h4 className="ui dividing header">Sortiraj po</h4>
              <Dropdown
                fluid
                selection
                options={sortOptions}
                value={sortOption}
                onChange={(e, { value }) => setSortOption(value)}
              />
            </div>
          </Grid.Column>

          <Grid.Column width={12}>
            <Card.Group itemsPerRow={3}>
              {paginatedClassrooms.length > 0 ? (
                paginatedClassrooms.map((classroom) => (
                  <Card key={classroom.id}>
                    <Card.Content>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Card.Header>{classroom.name}</Card.Header>
                        <Icon
                          name="edit"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(classroom)}
                        />
                      </div>
                      <Card.Description>
                        Sprat: {classroom.floor}
                        <br />
                        Kapacitet: {classroom.capacity}
                        <br />
                        <br />
                        Kursevi:{' '}
                        <div style={{ maxHeight: '62px', overflowY: 'auto' }}>
                          {classroom.courseCanUseClassrooms
                            .filter((cc) => cc.classroomId === classroom.id)
                            .map((cc) => {
                              const courseName = courses.find((course) => course.id === cc.courseId)?.name;
                              return courseName ? <span key={cc.courseId}>{courseName}<br /></span> : null;
                            })}
                          {!classroom.courseCanUseClassrooms.length ? 'Nema kurseva' : null}
                        </div>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        basic
                        color="teal"
                        onClick={() => openScheduleModal(classroom)}
                        onMouseEnter={(e) => e.target.classList.remove('basic')}
                        onMouseLeave={(e) => e.target.classList.add('basic')}
                      >
                        Raspored
                      </Button>
                      <Button
                        basic
                        color="red"
                        onClick={() => handleDeleteClick(classroom)}
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
      
      {currentClassroom && (
        <Modal open={scheduleModalOpen} onClose={closeModals}>
          <Modal.Header>Raspored za {currentClassroom.name}</Modal.Header>
          <Modal.Content>
            <ScheduleTable
              content={/* Unesite raspored za ovu učionicu */ []}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="teal" onClick={closeModals}>
              Zatvori
            </Button>
          </Modal.Actions>
        </Modal>
      )}

      <DeleteModal
        open={openDeleteModal}
        onClose={closeModals}
        header={header} 
        deleteItem={currentClassroom}
        refreshData={setData}
        showToast={showToast}
      />

      <AddModal 
        open={openAddModal} 
        onClose={closeModals} 
        header={header} 
        editItem={currentClassroom} 
        refreshData={setData}
        showToast={showToast}
      />

    </Container>
  );
};

export default ClassroomsPage;