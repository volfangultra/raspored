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

const StudentGroupsPage = () => {
  const header = 'Dodavanje smjera';
  const fetchStudentGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/student-groups?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudentGroups(data);
    } catch (error) {
      console.error('Failed to fetch student groups:', error);
    }
  };
  
  useEffect(() => {
    fetchStudentGroups();
  }, []);

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'yearAsc', text: 'Godina (rast.)', value: 'yearAsc' },
    { key: 'yearDesc', text: 'Godina (opad.)', value: 'yearDesc' },
  ];

  const [searchText, setSearchText] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [currentStudentGroup, setCurrentStudentGroup] = useState(null);
  const [studentgroups, setStudentGroups] = useState([]);

  const yearOptions = [...new Set(studentgroups.map(({ year }) => year))]
  .map((year) => ({ year }));

  console.log(yearOptions);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };
  
  const sortStudentGroups = (studentgroups) => {
    switch (sortOption) {
      case 'nameAsc':
        return studentgroups.sort((a, b) => a.name.localeCompare(b.name));
      case 'yearAsc':
        return studentgroups.sort((a, b) => a.year - b.year);
      case 'yearDesc':
        return studentgroups.sort((a, b) => b.year - a.year);
      default:
        return studentgroups;
    }
  };

  const filteredStudentGroups = sortStudentGroups(
    studentgroups.filter((studentgroup) => {
      if (
        searchText &&
        !studentgroup.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (filterYear && studentgroup.year !== filterYear) {
        return false;
      }
      return true;
    })
  );

  const handleEditClick = (studentgroup) => {
    setCurrentStudentGroup(studentgroup);
    setOpenAddModal(true);
  };

  const openScheduleModal = (studentgroup) => {
    setCurrentStudentGroup(studentgroup);
    setScheduleModalOpen(true);
  };

  const handleDeleteClick = (studentgroup) => {
    setCurrentStudentGroup(studentgroup);
    setOpenDeleteModal(true);
  };

  const closeModals = () => {
    setCurrentStudentGroup(null);
    setScheduleModalOpen(false);
    setOpenAddModal(false);
    setOpenDeleteModal(false);
  };

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredStudentGroups.length / itemsPerPage);
  const paginatedStudentGroups = filteredStudentGroups.slice(
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
              >
                Dodaj novi smjer
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
                placeholder="Godina"
                fluid
                selection
                options={yearOptions.map(({ year }) => ({
                  key: year,     // Unique key for each option
                  text: year,    // Text displayed in the dropdown
                  value: year,   // Value of the dropdown item
                }))}
                value={filterYear}
                onChange={(e, { value }) => setFilterYear(value)}
                clearable
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
              {paginatedStudentGroups.length > 0 ? (
                paginatedStudentGroups.map((studentgroup) => (
                  <Card key={studentgroup.id}>
                    <Card.Content>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Card.Header>{studentgroup.name}</Card.Header>
                        <Icon
                          name="edit"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(studentgroup)}
                        />
                      </div>
                      <Card.Description>
                        Godina: {studentgroup.year}
                        <br />
                        Kursevi:{' '}
                        {studentgroup.groupTakesCourses
                          .filter((cc) => cc.studentgroup_id === studentgroup.id)
                          .map(
                            (cc) =>
                              courses.find(
                                (course) => course.id === cc.course_id
                              )?.name
                          )
                          .join(', ') || 'Nema kurseva'}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        basic
                        color="teal"
                        onClick={() => openScheduleModal(studentgroup)}
                        onMouseEnter={(e) => e.target.classList.remove('basic')}
                        onMouseLeave={(e) => e.target.classList.add('basic')}
                      >
                        Raspored
                      </Button>
                      <Button
                        basic
                        color="red"
                        onClick={() => handleDeleteClick(studentgroup)}
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
      
      {currentStudentGroup && (
        <Modal open={scheduleModalOpen} onClose={closeModals}>
          <Modal.Header>Raspored za {currentStudentGroup.name}</Modal.Header>
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
        deleteItem={currentStudentGroup}
        refreshData={fetchStudentGroups}
        showToast={showToast}
      />

      <AddModal 
        open={openAddModal} 
        onClose={closeModals} 
        header={header} 
        editItem={currentStudentGroup} 
        refreshData={fetchStudentGroups}
        showToast={showToast}
      />

    </Container>
  );
};

export default StudentGroupsPage;
