import React, { useState } from 'react';
import {
  Container,
  Input,
  Dropdown,
  Grid,
  Card,
  Button,
  Modal,
  Form,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import ScheduleTable from './ScheduleTable';

const ClassroomsPage = () => {
  const floors = ['I', 'II', 'III', 'IV'];
  const courses = [
    { id: 1, name: 'Elementarna matematika' },
    { id: 2, name: 'Računarski sistemi' },
    { id: 3, name: 'Programiranje I' },
    { id: 4, name: 'Baze podataka' },
  ];

  const courses_classrooms = [
    { course_id: 1, classroom_id: 2 },
    { course_id: 2, classroom_id: 2 },
    { course_id: 3, classroom_id: 2 },
    { course_id: 3, classroom_id: 3 },
    { course_id: 3, classroom_id: 4 },
    { course_id: 4, classroom_id: 7 },
  ];

  const classroomsData = [
    { id: 1, name: '441', floor: 'IV', size: 30 },
    { id: 2, name: 'ABG', floor: 'I', size: 150 },
    { id: 3, name: 'VRC', floor: 'I', size: 60 },
    { id: 4, name: 'RC', floor: 'IV', size: 40 },
    { id: 5, name: '428', floor: 'IV', size: 30 },
    { id: 6, name: '432', floor: 'IV', size: 30 },
    { id: 7, name: '419', floor: 'IV', size: 30 },
    { id: 8, name: '412', floor: 'IV', size: 30 },
  ];

  const sortOptions = [
    { key: 'nameAsc', text: 'Ime (A-Z)', value: 'nameAsc' },
    { key: 'sizeAsc', text: 'Broj mjesta (rast.)', value: 'sizeAsc' },
    { key: 'sizeDesc', text: 'Broj mjesta (opad.)', value: 'sizeDesc' },
  ];

  const sizeOptions = [
    { key: 'greater', text: 'Veći od 50', value: 'greater' },
    { key: 'smaller', text: 'Manji od 50', value: 'smaller' },
  ];

  const [searchText, setSearchText] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState(null);

  const sortClassrooms = (classrooms) => {
    switch (sortOption) {
      case 'nameAsc':
        return classrooms.sort((a, b) => a.name.localeCompare(b.name));
      case 'sizeAsc':
        return classrooms.sort((a, b) => a.size - b.size);
      case 'sizeDesc':
        return classrooms.sort((a, b) => b.size - a.size);
      default:
        return classrooms;
    }
  };

  const filteredClassrooms = sortClassrooms(
    classroomsData.filter((classroom) => {
      if (
        searchText &&
        !classroom.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (filterFloor && classroom.floor !== filterFloor) {
        return false;
      }
      if (filterSize === 'greater' && classroom.size <= 50) {
        return false;
      }
      if (filterSize === 'smaller' && classroom.size > 50) {
        return false;
      }
      return true;
    })
  );

  const handleEditClick = (classroom) => {
    setCurrentClassroom(classroom);
    setModalOpen(true);
  };

  const openScheduleModal = (classroom) => {
    setCurrentClassroom(classroom);
    setScheduleModalOpen(true);
  };

  const handleDeleteClick = (classroom) => {
    setCurrentClassroom(classroom);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    //setClassroomsData((prev) => prev.filter((c) => c.id !== currentClassroom.id));
    setDeleteModalOpen(false);
    setCurrentClassroom(null);
  };

  const handleAddClassroom = (newClassroom) => {
    //setClassroomsData((prev) => [...prev, { ...newClassroom, id: prev.length + 1 }]);
    setAddModalOpen(false);
  };

  const closeModals = () => {
    setCurrentClassroom(null);
    setModalOpen(false);
    setScheduleModalOpen(false);
    setAddModalOpen(false);
    setDeleteModalOpen(false);
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
                onClick={() => setAddModalOpen(true)}
                fluid
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
                      <Card.Meta>{classroom.size} mjesta</Card.Meta>
                      <Card.Description>
                        Sprat: {classroom.floor}
                        <br />
                        Kursevi:{' '}
                        {courses_classrooms
                          .filter((cc) => cc.classroom_id === classroom.id)
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
                  Nema učionica koje odgovaraju filterima.
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
        <Modal open={modalOpen} onClose={closeModals}>
          <Modal.Header>Uredi učionicu</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Ime"
                value={currentClassroom.name}
                onChange={(e) =>
                  setCurrentClassroom({
                    ...currentClassroom,
                    name: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Broj mjesta"
                type="number"
                value={currentClassroom.size}
                onChange={(e) =>
                  setCurrentClassroom({
                    ...currentClassroom,
                    size: e.target.value,
                  })
                }
              />
              <Form.Input
                label="Sprat"
                value={currentClassroom.floor}
                onChange={(e) =>
                  setCurrentClassroom({
                    ...currentClassroom,
                    floor: e.target.value,
                  })
                }
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="teal">Sačuvaj</Button>
            <Button basic color="teal" onClick={closeModals}>
              Odustani
            </Button>
          </Modal.Actions>
        </Modal>
      )}
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
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header>Potvrda brisanja</Modal.Header>
        <Modal.Content>
          Jeste li sigurni da želite obrisati učionicu {currentClassroom?.name}?
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={confirmDelete}>
            Obriši
          </Button>
          <Button onClick={() => setDeleteModalOpen(false)}>Odustani</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Modal.Header>Dodaj učionicu</Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const newClassroom = {
                name: form.name.value,
                size: parseInt(form.size.value, 10),
                floor: form.floor.value,
              };
              handleAddClassroom(newClassroom);
            }}
          >
            <Form.Input label="Ime" name="name" required />
            <Form.Input
              label="Broj mjesta"
              name="size"
              type="number"
              required
            />
            <Form.Input label="Sprat" name="floor" required />
            <Button type="submit" primary>
              Dodaj
            </Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="teal">Sačuvaj</Button>
          <Button basic color="teal" onClick={closeModals}>
            Odustani
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default ClassroomsPage;
