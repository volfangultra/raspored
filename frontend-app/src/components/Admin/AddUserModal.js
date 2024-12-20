import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, Message, Dropdown, Icon, Popup, Label, Grid, GridColumn } from 'semantic-ui-react';

const facultyOptions = [
  { key: 'pmf', text: 'Prirodno-matematički', value: 'Prirodno-matematički' },
  { key: 'etf', text: 'Elektrotehnički fakultet', value: 'Elektrotehnički' },
  { key: 'ef', text: 'Ekonomski fakultet', value: 'Ekonomski' },
  { key: 'ff', text: 'Filozofski fakultet', value: 'Filozofski' },
];

const AddUserModal = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [faculty, setFaculty] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [existingUsernames, setExistingUsernames] = useState([]);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found, user is not authenticated.");
    }
    return token;
  };

  const fetchUsernames = async () => {
    try {
      const token = getToken();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const usernames = data.map(user => user.username);
      setExistingUsernames(usernames);
    } catch (error) {
      console.error('Failed to fetch professors:', error);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  useEffect(() => {
    const formValid =
      username.trim() !== "" &&
      !existingUsernames.includes(username) &&
      validatePassword(password) &&
      faculty &&
      validateEmail(email);
    setIsValid(formValid);
  }, [username, password, faculty, email]);

  const handleSubmit = async () => {
    if (existingUsernames.includes(username)) {
      setError("Korisničko ime već postoji. Molimo izaberite drugo.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Šifra mora biti duža od 8 karaktera i sadržavati slova, brojeve i neke od znakova @$!%*?&."      );
      return;
    }

    const token = getToken();

    const userData = {
      username,
      email,
      passwordHash: password,
      role: 'user',
    }

    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        console.log(response);
      }
    } catch (error) {
      console.error("Greška prilikom slanja podataka:", error);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false); 
      onClose(); 
      setUsername(''); 
      setPassword(''); 
      setError(null);
      setFaculty('');
    }, 3000); 
  }



return (
  <Modal open={open} onClose={onClose} size="small">
    <Modal.Header>Dodavanje novog korisnika</Modal.Header>
    {success && (
      <Message
        success
        header="Korisnik uspješno kreiran"
        content="Novi korisnik je uspješno dodan u sistem."
      />
    )}
    <Modal.Content>
      <Form>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form.Field>
                <label>Korisničko ime</label>
                <Input
                  placeholder="Unesite username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {existingUsernames.includes(username) && (
                  <Label basic color="red" pointing>
                    Username već postoji.
                  </Label>
                )}
              </Form.Field>
            </Grid.Column>
            <GridColumn>
              <Form.Field>
                <label>Šifra</label>
                <Popup
                  trigger={
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Unesite šifru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={
                        <Icon
                          name={showPassword ? "eye slash" : "eye"}
                          link
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      }
                    />
                  }
                  content="Šifra mora imati barem 8 karaktera, uključujući slova, brojeve i neke od znakova @$!%*?&."
                  position="bottom"
                  open={password.length > 0 && !validatePassword(password)}
                />
              </Form.Field>
            </GridColumn>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form.Field>
                <label>Fakultet</label>
                <Dropdown
                  placeholder="Odaberite fakultet"
                  fluid
                  selection
                  options={facultyOptions}
                  value={faculty}
                  onChange={(e, { value }) => setFaculty(value)}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Email</label>
                <Input
                  placeholder="Unesite email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={email && !validateEmail(email)}
                />
                {email && !validateEmail(email) && (
                  <Label basic color="red" pointing>
                    Unesite validnu email adresu.
                  </Label>
                )}
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      {error && <Message negative>{error}</Message>}
    </Modal.Content>
    <Modal.Actions>
      <Button color="teal" onClick={handleSubmit} disabled={!isValid}>
        Kreiraj
      </Button>
      <Button color="teal" basic onClick={onClose}>Odustani</Button>

    </Modal.Actions>
  </Modal>
  );
};

// Define PropTypes
AddUserModal.propTypes = {
  open: PropTypes.bool.isRequired, // Ensure open is a required boolean
  onClose: PropTypes.func.isRequired, // Ensure onClose is a required function
};

export default AddUserModal;
