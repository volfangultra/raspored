import React, { useState, useEffect } from 'react';
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
import { fetchSchedules, fetchProfessors, fetchCourses } from '../services/apiServices';
import * as XLSX from 'xlsx';
import axios from 'axios';

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
  const userId = localStorage.getItem('userId');

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'rankAsc', text: 'Zvanje (rast.)', value: 'rankAsc' },
    { key: 'rankDesc', text: 'Zvanje (opad.)', value: 'rankDesc' }
  ];

  const [searchText, setSearchText] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  const [firstLoad, setFirstLoad] = useState(true);
  const [worksheet, setWorksheet] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const setData = async () => {
    try {
      const schedules = await fetchSchedules(userId);
      setScheduleOptions(schedules);
      const allProfessors = [], allCourses = [];
      for (const schedule of schedules) {
        const professorsData = await fetchProfessors(schedule.key); 
        const coursesData = await fetchCourses(schedule.key); 
        professorsData.forEach((professor) => {
          allProfessors.push({ ...professor, scheduleId: schedule.key});  
        });
        coursesData.forEach((course) => {
          allCourses.push({ ...course, scheduleId: schedule.key});  
        });
      }
      setProfessors(allProfessors);
      setCourses(allCourses);
    } catch (error) {
      console.error('Failed to fetch schedules or classrooms:', error);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      setWorksheet(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
      //const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Refresh data or notify user after upload
      // refreshData();
      // showToast('Classrooms successfully added!', 'success');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async () => {
    for (const row of worksheet) {
      //if(!(row.Zvanje in ['Asistent', 'Viši asistent', 'Docent', 'Vanredni profesor', 'Redovni profesor'])) { row.Zvanje = ''; }
      const name = `${row.Ime} ${row.Prezime}`;
      const professorData = {
        firstName: String(row.Ime),
        lastName: String(row.Prezime),
        Rank: row.Zvanje,
        ScheduleId: localStorage.getItem('scheduleId'),
        Name: name,
        professorUnavailabilities: [],
      };

      console.log(professorData);

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/professors`, professorData);
      } catch (error) {
        console.error('Error adding professor:', error);
      }
    }
    setData();
    showToast('Osoblje uspješno dodano!', 'success');
  };
  
  useEffect(() => {
    setData();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    filterRank,
    selectedSchedule,
  ]);
  
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
      if (selectedSchedule && professor.scheduleId !== selectedSchedule) {
        return false;
      }
      return true;
    })
  );

  const handleEditClick = (professor) => {
    setCurrentProfessor(professor);
    setOpenAddModal(true);
  };


  const handleDeleteClick = async (professor) => {
    if (header=='Dodavanje osoblja' && courses.find(course => course.professorId === professor.id)) {
      showToast(`Nije moguće obrisati ${professor.name} zbog veze sa kursem.`, 'error');
      return;
    }
    setCurrentProfessor(professor);
    setOpenDeleteModal(true);
  };

  const closeModals = () => {
    setCurrentProfessor(null);
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

  useEffect(() => {
    if(firstLoad) {setFirstLoad(false); return;}
    handleFileUpload();
  }, [worksheet]);

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
                placeholder="Odaberite raspored za pregled osoblja"
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
                forceSelection={false}
                selectOnBlur={false}
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
                Dodaj novo osoblje
                <Icon name="plus" style={{ marginLeft: '10px' }} />
              </Button>
              <Button
                basic
                as="label"
                type="button"
                color="teal"
                htmlFor="file"
                fluid
                disabled={!selectedSchedule}
                onMouseEnter={(e) => e.target.classList.remove('basic')}
                onMouseLeave={(e) => e.target.classList.add('basic')}
                style={{
                  marginTop: '10px',
                  transition: 'all 0.3s ease',
                  opacity: selectedSchedule ? 1 : 0.5,
                  cursor: selectedSchedule ? 'pointer' : 'not-allowed',
                }}
                title='Fajl treba da ima tri kolone [Ime, Prezime, Zavnje], a u redove idu podaci o svakoj učionici. Zabrane za profesore se unose naknadno.'
              >
                Učitaj XLSX fajl osoblja
                <Icon name="upload" style={{ marginLeft: '10px' }} />
              </Button>
              <Input
                type="file"
                id="file"
                accept=".xlsx"
                hidden
                style={{display: 'none'}}
                onChange={(e)=>{handleFileInput(e); handleFileUpload();}}
                disabled={!selectedSchedule}
              />
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
                          disabled={!selectedSchedule}
                        />
                      </div>
                      <Card.Description>
                        Zvanje: {professor.rank}
                        <br />
                        <br />
                        Zabrane: {professor.professorUnavailabilities.length > 0 ? (
                            <div style={{ maxHeight: '62px', overflowY: 'auto' }}>
                            {professor.professorUnavailabilities
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

      <DeleteModal
        open={openDeleteModal}
        onClose={closeModals}
        header={header} 
        deleteItem={currentProfessor}
        refreshData={setData}
        showToast={showToast}
      />

      <AddModal 
        open={openAddModal} 
        onClose={closeModals} 
        header={header} 
        editItem={currentProfessor} 
        refreshData={setData}
        showToast={showToast}
      />

    </Container>
  );
};

export default ProfessorsPage;
