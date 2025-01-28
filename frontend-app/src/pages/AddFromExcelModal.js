import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Table, Dropdown } from "semantic-ui-react";
import axios from "axios";
import { fetchProfessors } from "../services/apiServices";

const AddFromExcelModal = ({
  open,
  onClose,
  xlsxFormData,
  setXlsxFormData,
  refreshData,
  showToast,
  scheduleId,
}) => {
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfessors(scheduleId);
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };
    if (scheduleId) fetchData();
  }, [scheduleId]);

  const handleProfessorChange = (professorId, index) => {
    const updatedData = [...xlsxFormData];
    updatedData[index].professorId = professorId;
    setXlsxFormData(updatedData);
  };

  const handleSave = async () => {
    const url = `${process.env.REACT_APP_API_URL}/courses`;
    console.log(xlsxFormData)
    for (const data of xlsxFormData) {
        try {
            await axios.post(url, data);
            showToast("Kursevi uspješno dodani!", "success");
            onClose();
          } catch (error) {
            console.error("Error saving courses:", error); 
          }
          refreshData();
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="large">
      <Modal.Header>Odabir profesora za predmete</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Naziv predmeta</Table.HeaderCell>
              <Table.HeaderCell>Trajanje</Table.HeaderCell>
              <Table.HeaderCell>Tip</Table.HeaderCell>
              <Table.HeaderCell>Profesor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {xlsxFormData.map((course, index) => (
              <Table.Row key={index}>
                <Table.Cell>{course.name}</Table.Cell>
                <Table.Cell>{course.lectureSlotLength}</Table.Cell>
                <Table.Cell>{course.type}</Table.Cell>
                <Table.Cell>
                  <Dropdown
                    placeholder="Odaberi profesora"
                    selection
                    options={professors.map((prof) => ({
                      key: prof.id,
                      text: prof.name,
                      value: prof.id,
                    }))}
                    value={course.professorId}
                    onChange={(e, { value }) =>
                      handleProfessorChange(value, index)
                    }
                    forceSelection={false}
                    selectOnBlur={false}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button color="teal" onClick={handleSave}>
          Sačuvaj
        </Button>
        <Button basic color="teal" onClick={onClose}>
          Odustani
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

AddFromExcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  xlsxFormData: PropTypes.array.isRequired,
  setXlsxFormData: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  scheduleId: PropTypes.string.isRequired,
};

export default AddFromExcelModal;
