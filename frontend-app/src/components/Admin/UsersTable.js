import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Button, Pagination, GridRow, Header, GridColumn, Segment } from 'semantic-ui-react';
import DeleteConfirmationModal from './DeleteUserModal';

const UsersTable = ({setFunction}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteName, setDeleteName] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, user is not authenticated.');
    }
    return token;
  };
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };


  useEffect(() => {
    fetchUsers();
    setFunction(fetchUsers);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  return (
    <GridRow>
      <GridColumn width={16}>
        <Segment>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Header as="h2" textAlign="center">
                    Tabela korisnika
            </Header>
          </div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Korisničko ime</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Ukloni korisnika</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {currentUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    <Button ui negative basic onClick={() => {setOpenDelete(true); setDeleteId(user.id); setDeleteName(user.username);} }><Icon name="trash" /> Ukloni</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Pagination
            totalPages={totalPages}
            activePage={currentPage}
            onPageChange={handlePageChange}
            siblingRange={1}
            boundaryRange={0}
          />
        </Segment>
      </GridColumn>
      <DeleteConfirmationModal fetchUsers={fetchUsers} open={openDelete} onClose={() => setOpenDelete(false)} userId={deleteId} deleteName={deleteName}/>
    </GridRow>
  );
};

UsersTable.propTypes = {
  setFunction: PropTypes.func.isRequired,
};

export default UsersTable;
