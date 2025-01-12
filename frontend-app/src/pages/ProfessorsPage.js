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

const ProfessorsPage = () => {
  const header = 'Dodavanje osoblja';
  const ranks = ['Asistent', 'Viši asistent', 'Docent', 'Vanredni profesor', 'Redovni profesor'];
  const daysOptions = [
    { key: 0, value: 'Ponedjeljak', text: 'Ponedjeljak' },
    { key: 1, value: 'Utorak', text: 'Utorak' },
    { key: 2, value: 'Srijeda', text: 'Srijeda' },
    { key: 3, value: 'Četvrtak', text: 'Četvrtak' },
    { key: 4, value: 'Petak', text: 'Petak' },
  ];
  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/professors?scheduleId=${localStorage.getItem('scheduleId')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setProfessors(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };
  
  useEffect(() => {
    fetchProfessors();
  }, []);

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'rankAsc', text: 'Zvanje (rast.)', value: 'rankAsc' },
    { key: 'rankDesc', text: 'Zvanje (opad.)', value: 'rankDesc' }
  ];

  const [searchText, setSearchText] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [professors, setProfessors] = useState([]);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };
  
  const sortProfessors = (professors) => {
    switch (sortOption) {
      case 'nameAsc':
        return professors.sort((a, b) => a.name.localeCompare(b.name));
      case 'rankAsc':
        return professors.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
      case 'rankDesc':
        return professors.sort((a, b) => ranks.indexOf(b.rank) - ranks.indexOf(a.rank));
      default:
        return professors;
    }
  };

  const filteredProfessors = sortProfessors(
    professors.filter((professor) => {
      if (
        searchText &&
        !professor.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (filterRank === 'Asistent' && professor.rank != 'Asistent') {
        return false;
      }
      if (filterRank === 'Viši asistent' && professor.rank != 'Viši asistent') {
        return false;
      }
      if (filterRank === 'Docent' && professor.rank != 'Docent') {
        return false;
      }
      if (filterRank === 'Vanredni profesor' && professor.rank != 'Vanredni profesor') {
        return false;
      }
      if (filterRank === 'Redovni profesor' && professor.rank === 'Redovni profesor') {
        return false;
      }
      return true;
    })
  );

  const handleEditClick = (professor) => {
    setCurrentProfessor(professor);
    setOpenAddModal(true);
  };

  const openScheduleModal = (professor) => {
    setCurrentProfessor(professor);
    setScheduleModalOpen(true);
  };

  const handleDeleteClick = (professor) => {
    setCurrentProfessor(professor);
    setOpenDeleteModal(true);
  };

  const closeModals = () => {
    setCurrentProfessor(null);
    setScheduleModalOpen(false);
    setOpenAddModal(false);
    setOpenDeleteModal(false);
  };

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredProfessors.length / itemsPerPage);
  const paginatedProfessors = filteredProfessors.slice(
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
                Dodaj novo osoblje
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
                placeholder="Zvanje"
                fluid
                selection
                options={ranks.map((rank) => ({
                  key: rank,
                  text: `${rank}`,
                  value: rank,
                }))}
                value={filterRank}
                onChange={(e, { value }) => setFilterRank(value)}
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
              {paginatedProfessors.length > 0 ? (
                paginatedProfessors.map((professor) => (
                  <Card key={professor.id}>
                    <Card.Content>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Card.Header>{professor.name}</Card.Header>
                        <Icon
                          name="edit"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditClick(professor)}
                        />
                      </div>
                      <Card.Description>
                        Zvanje: {professor.rank}
                        <br />
                        <br />
                        Zabrane: {professor.professorAvailabilities.length > 0 ? (
                            <div style={{ maxHeight: '62px', overflowY: 'auto' }}>
                            {professor.professorAvailabilities
                                .sort((a, b) => {
                                    if (a.day !== b.day) {
                                        return a.day - b.day;
                                    }
                                    if (a.startTime !== b.startTime) {
                                        return a.startTime.localeCompare(b.startTime);
                                    }
                                    return a.endTime.localeCompare(b.endTime);
                                }).map((availability, index) => {
                                const day = daysOptions.find(day => day.key === availability.day);
                                const formatTime = (time) => {
                                    const [hours, minutes] = time.split(':');
                                    return `${hours}:${minutes}`;
                                };

                                return (
                                    <div key={index}>
                                        {day ? day.text : availability.day}: {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                                    </div>
                                );
                            })}
                        </div>
                        ) : (
                            "Nema"
                        )
                        }  
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        basic
                        color="teal"
                        onClick={() => openScheduleModal(professor)}
                        onMouseEnter={(e) => e.target.classList.remove('basic')}
                        onMouseLeave={(e) => e.target.classList.add('basic')}
                      >
                        Raspored
                      </Button>
                      <Button
                        basic
                        color="red"
                        onClick={() => handleDeleteClick(professor)}
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
                  Nema osoblja koji odgovaraju filterima.
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
      
      {currentProfessor && (
        <Modal open={scheduleModalOpen} onClose={closeModals}>
          <Modal.Header>Raspored za {currentProfessor.name}</Modal.Header>
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
        deleteItem={currentProfessor}
        refreshData={fetchProfessors}
      />

      <AddModal 
        open={openAddModal} 
        onClose={closeModals} 
        header={header} 
        editItem={currentProfessor} 
        refreshData={fetchProfessors}
        showToast={showToast}
      />

    </Container>
  );
};

export default ProfessorsPage;
