import React, { useState } from 'react';
import { Container, Header, Grid, Button } from 'semantic-ui-react';
import AddUserModal from '../../components/Admin/AddUserModal';
import StatisticsSection from '../../components/Admin/StatisticsSection';
import UsersTable from '../../components/Admin/UsersTable';

const AdminHomePage = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [fetchUsersFunction, setChildAFunction] = useState(null);

  const handleSetFunction = (func) => {
    setChildAFunction(() => func); // Save the function
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Header as="h1" dividing>
          Kontrolna ploča
        </Header>
        <Button color="teal" size="large" onClick={() => setModalOpen(true)}>
          Dodaj korisnika
        </Button>
      </div>

      <Grid stackable>
        <StatisticsSection />
        <UsersTable setFunction={handleSetFunction}/>
      </Grid>

      <AddUserModal fetchUsersFunction={fetchUsersFunction} open={isModalOpen} onClose={() => setModalOpen(false)} />

    </Container>
  );
};

export default AdminHomePage;
