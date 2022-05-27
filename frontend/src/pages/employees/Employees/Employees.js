import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useEmployeesData } from '../../../hooks/employeeQueries';
import { CurrentUserContext } from '../../../context/UserContext';
import Modal from '../../../components/modal/Modal';
import EmployeeForm from '../EmployeeForm';
import Button from '@mui/material/Button';
import Datatable from '../../../components/datatable/Datatable';
import Loading from '../../../components/loading/Loading';
import Error from '../../../components/error/Error';

import './employees.scss';

const Employees = () => {
  const { currentEmployeePosition } = useContext(CurrentUserContext);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, data, isError, error, isSuccess } = useEmployeesData();

  const closeModal = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Error error={error} />;
  }

  if (isSuccess) {
    const cols = [
      {
        field: 'name',
        headerName: 'Navn',
        flex: 1,
        sortable: true,
      },
      {
        field: 'position',
        headerName: 'Stilling',
        flex: 1,
        sortable: true,
      },
      {
        field: 'email',
        headerName: 'email',
        flex: 1,
        sortable: true,
      },
      {
        field: 'region_name',
        headerName: 'Region',
        flex: 1,
        sortable: true,
      },
      {
        field: 'employee_id',
        headerName: 'Ansattnr.',
        flex: 1,
        sortable: true,
      },
      {
        field: 'date_created',
        headerName: 'Dato Opprettet',
        flex: 1,
        sortable: true,
      },
      {
        field: 'action',
        headerName: '',
        width: 100,

        renderCell: (params) => {
          return (
            <div className='cellAction'>
              <Link
                to={`/employees/${params.row.employee_id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className='viewButton'>View</div>
              </Link>
            </div>
          );
        },
      },
    ];

    const rows = [];
    for (let key in data.data) {
      rows.push(data.data[key]);
    }

    return (
      <section id='employees-page'>
        {currentEmployeePosition === 'Admin' || 'Serviceleder' ? (
          <div className='button-container'>
            <Button color='secondary' variant='contained' onClick={setIsOpen}>
              Legg til ansatt
            </Button>
          </div>
        ) : null}

        <Datatable
          columns={cols}
          rows={rows}
          rowId={(row) => row.employee_id}
        />
        <Modal open={isOpen} onClose={() => closeModal()}>
          <EmployeeForm closeModal={closeModal} />
        </Modal>
      </section>
    );
  }
};

export default Employees;
