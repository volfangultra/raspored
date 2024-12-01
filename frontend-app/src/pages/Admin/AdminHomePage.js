import React, {useState} from 'react';
import { Container, Header, Grid, Statistic, Segment, Divider, Card, Icon, Button } from 'semantic-ui-react';
import { ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import AddUserModal from '../../components/Admin/AddUserModal';

const userGrowthData = [
  { month: 'Jan', users: 200 },
  { month: 'Feb', users: 400 },
  { month: 'Mar', users: 600 },
  { month: 'Apr', users: 800 },
  { month: 'Maj', users: 1000 },
];

const scheduleData = [
  { day: 'Pon', schedules: 50 },
  { day: 'Uto', schedules: 70 },
  { day: 'Sri', schedules: 100 },
  { day: 'Čet', schedules: 90 },
  { day: 'Pet', schedules: 120 },
];

const AdminHomePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Header as="h1" dividing>
        Kontrolna ploča
      </Header>

      <Grid stackable>
        {/* Statistics Section */}
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header as="h2" textAlign="center">
                  Pregled statistike
                </Header>
                <Button color="teal" size="large" onClick={() => setModalOpen(true)}>
                  Dodaj korisnika
                </Button>
              </div>
              <Divider />
              <Statistic.Group widths="3" size="large">
                <Statistic>
                  <Statistic.Value>1,024</Statistic.Value>
                  <Statistic.Label>Korisnika</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>78</Statistic.Value>
                  <Statistic.Label>Kreiranih rasporeda</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>12</Statistic.Value>
                  <Statistic.Label>Fakulteta</Statistic.Label>
                </Statistic>
              </Statistic.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        {/* Graphs Section */}
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment>
              <Header as="h3" dividing>
                Rast korisnika
              </Header>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="teal" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Segment>
          </Grid.Column>

          <Grid.Column width={8}>
            <Segment>
              <Header as="h3" dividing>
                Kreiranje rasporeda proteklih dana
              </Header>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="schedules" fill="teal" />
                </BarChart>
              </ResponsiveContainer>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <AddUserModal open={isModalOpen} onClose={() => setModalOpen(false)} />

    </Container>
  );
};

export default AdminHomePage;
