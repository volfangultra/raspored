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
import ToastMessage from '../components/ToastMessage';
import { fetchSchedules, fetchCourses, fetchStudentGroups } from '../services/apiServices';
import * as XLSX from 'xlsx';
import axios from 'axios';

const StudentGroupsPage = () => {
  const header = 'Dodavanje smjera';
  const userId = localStorage.getItem('userId');
  const [courses, setCourses] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  const [firstLoad, setFirstLoad] = useState(true);
  const [worksheet, setWorksheet] = useState([]);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [currentStudentGroup, setCurrentStudentGroup] = useState(null);
  const [studentgroups, setStudentGroups] = useState([]);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const setData = async () => {
    try {
      const schedules = await fetchSchedules(userId);
      setScheduleOptions(schedules);
      const allStudentGroups = [],
        allCourses = [];
      for (const schedule of schedules) {
        const studentGroupsData = await fetchStudentGroups(schedule.key);
        studentGroupsData.forEach((group) => {
          allStudentGroups.push({ ...group, scheduleId: schedule.key });
        });

        const coursesData = await fetchCourses(schedule.key);
        allCourses.push(...coursesData);
      }
      setStudentGroups(allStudentGroups);
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
      const studentGroupData = {
        Name: String(row.Naziv),
        Major: '',
        Year: row.Godina,
        ScheduleId: localStorage.getItem('scheduleId'),
        GroupTakesCourses: [],
      };

      console.log(studentGroupData);

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/student-groups`, studentGroupData);
      } catch (error) {
        console.error('Error adding student group:', error);
      }
    }
    setData();
    showToast('Smjerovi uspješno dodani!', 'success');
  };

  useEffect(() => {
    if(firstLoad) {setFirstLoad(false); return;}
    handleFileUpload();
  }, [worksheet]);
  
  useEffect(() => {
    setData();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchText, filterYear, sortOption, selectedSchedule]);

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'yearAsc', text: 'Godina (rast.)', value: 'yearAsc' },
    { key: 'yearDesc', text: 'Godina (opad.)', value: 'yearDesc' },
  ];

  const yearOptions = [...new Set(studentgroups.map(({ year }) => year))]
  .map((year) => ({ year }));
  
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
      if (selectedSchedule && studentgroup.scheduleId !== selectedSchedule) {
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
        <ToastMessage message={toast.message} type={toast.type} />
      )}

      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <div style={{ marginBottom: '20px' }}>
              <Dropdown
                placeholder="Odaberite raspored za pregled grupa"
                fluid
                selection
                options={scheduleOptions}
                onChange={(e, { value }) => {
                  setSelectedSchedule(value);
                  if (value) {
                    localStorage.setItem('scheduleId', value); // Save to localStorage
                  } else {
                    localStorage.removeItem('scheduleId'); // Remove if cleared
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
                disabled={selectedSchedule ? false : true}
              >
                Dodaj novi smjer
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
                title='Fajl treba da ima dvije kolone [Naziv, Godina], a u redove idu podaci o svakoj učionici. Kursevi za smjerove se unose naknadno.'
              >
                Učitaj XLSX fajl smjerova
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
                        <div style={{ maxHeight: '62px', overflowY: 'auto' }}>
                          {studentgroup.groupTakesCourses
                            .filter((gc) => gc.studentGroupId === studentgroup.id)
                            .map((gc) => {
                              const courseName = courses.find((course) => course.id === gc.courseId)?.name;
                              return courseName ? <span key={gc.courseId}>{courseName}<br /></span> : null;
                            })}
                            {!studentgroup.groupTakesCourses.length ? 'Nema kurseva' : null}
                        </div>
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
        refreshData={setData}
        showToast={showToast}
      />

      <AddModal 
        open={openAddModal} 
        onClose={closeModals} 
        header={header} 
        editItem={currentStudentGroup} 
        refreshData={setData}
        showToast={showToast}
      />

    </Container>
  );
};

export default StudentGroupsPage;
