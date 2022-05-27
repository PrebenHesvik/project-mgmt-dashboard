import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../../../../components/modal/Modal";
import {
  useFetchAssignedEmployees,
  useAddAssignedEmployee,
  useDeleteAssignedEmployee,
} from "../../../../hooks/assignedEmployeesQueries";
import Button from "@mui/material/Button";
import {
  StyledTextField,
  StyledMenuItem,
} from "../../../../components/common/StyledTextField";
import { useConstraints } from "./../../../../hooks/useConstraints";
import { StyledFormBox } from "../../../../components/common/StyledFormBox";
import { StyledFormTitle } from "../../../../components/common/StyledFormTitle";

import "./assigned-employees.scss";

export const AssignedEmployees = ({ inspectionId }) => {
  const { data } = useFetchAssignedEmployees(inspectionId);
  const { data: constraints, isLoading, isError, error } = useConstraints();
  const { mutate: addAssignedEmployee } = useAddAssignedEmployee();
  const { mutate: deleteAssignedEmployee } = useDeleteAssignedEmployee();
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAssignedEmployee({
      employee_id: assignedEmployee,
      inspection_id: inspectionId,
    });
    closeModal();
  };

  const handleDelete = (id) => deleteAssignedEmployee(id);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="assigned-employee-cards">
      <h3 className="title">MONTØRER</h3>
      <AddIcon id="assigned-employee-cards-icon" onClick={setIsOpen} />
      <div className="cards-body">
        {data?.data.map((obj) => {
          return (
            <div
              key={obj["employee"]["employee_id"]}
              className="assigned-employee-card"
            >
              <h5 className="name">{obj["employee"]["name"]}</h5>
              <span className="position">{obj["employee"]["position"]}</span>
              <DeleteIcon onClick={() => handleDelete(obj["assignment_id"])} />
            </div>
          );
        })}
      </div>
      <Modal open={isOpen} onClose={() => closeModal()}>
        <StyledFormBox>
          <StyledFormTitle variant="h6" color="whitesmoke">
            Legg til ansatt
          </StyledFormTitle>
          <StyledTextField
            fullWidth
            select
            variant="filled"
            id=""
            label="Montør"
            name="assignedEmployee"
            value={assignedEmployee}
            onChange={(e) => setAssignedEmployee(e.target.value)}
          >
            {constraints.data["employees"].map((obj) => {
              return (
                <StyledMenuItem
                  key={obj["employee_id"]}
                  value={obj["employee_id"]}
                >
                  {obj["name"]}
                </StyledMenuItem>
              );
            })}
          </StyledTextField>
          <Button color="secondary" variant="contained" onClick={handleSubmit}>
            Legg til montør
          </Button>
        </StyledFormBox>
      </Modal>
    </div>
  );
};
