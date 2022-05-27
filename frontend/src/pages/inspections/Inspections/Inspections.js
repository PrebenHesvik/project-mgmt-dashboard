import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Datatable from '../../../components/datatable/Datatable';
import { useInspectionsData } from '../../../hooks/InspectionQueries';
import { CurrentUserContext } from '../../../context/UserContext';
import Modal from '../../../components/modal/Modal';
import InspectionForm from '../InspectionForm';
import Loading from '../../../components/loading/Loading';
import Error from '../../../components/error/Error';

import './inspections.scss';

const parseJson = (data) => {
  const rows = [];
  for (let outerKey in data.data) {
    let obj = {};
    for (let key in data.data[outerKey]) {
      let item = data.data[outerKey][key];
      if (Array.isArray(item) && key !== 'comments') {
        const assignedEmployees = [];
        for (let arr in item) {
          let name = item[arr]['employee']['name'];
          assignedEmployees.push(name);
        }
        obj['assigned_employees'] = assignedEmployees;
      } else if (typeof item === 'object' && key === 'customer') {
        obj['customer'] = item['name'];
      } else if (typeof item === 'object' && key === 'employee') {
        obj['created_by'] = item['name'];
      } else if (typeof item !== 'object') {
        obj[key] = item;
      }
    }
    rows.push(obj);
  }
  return rows;
};

const Inspection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isLoading, data, isError, error, isSuccess } = useInspectionsData();
  const { currentEmployeePosition } = useContext(CurrentUserContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Error error={error} />;
  }

  if (isSuccess) {
    const tableColumns = [
      {
        field: 'inspection_id',
        headerName: 'ID',
        sortable: true,
        width: 50,
      },
      {
        field: 'customer',
        headerName: 'Kunde',
        flex: 1,
        sortable: true,
      },
      {
        field: 'inspection_year',
        headerName: 'År',
        flex: 1,
        sortable: true,
      },
      {
        field: 'inspection_month',
        headerName: 'Måned',
        flex: 1,
        sortable: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        sortable: true,
        renderCell: (params) => {
          return (
            <p className={`cellWithStatus ${params.row.status}`}>
              {params.row.status}
            </p>
          );
        },
      },
      {
        field: 'description',
        headerName: 'Beskrivelse',
        flex: 2,
        sortable: true,
      },
      {
        field: 'created_by',
        headerName: 'Opprettet av',
        flex: 1,
        sortable: true,
      },
      {
        field: 'assigned_employees',
        headerName: 'Montør',
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
                to={`/inspections/${params.row.inspection_id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className='viewButton'>View</div>
              </Link>
            </div>
          );
        },
      },
    ];

    return (
      <section id='inspections-page'>
        {currentEmployeePosition === 'Admin' || 'Serviceleder' ? (
          <div className='button-container'>
            <Button
              color='secondary'
              variant='contained'
              onClick={setModalIsOpen}
            >
              Legg til inspeksjon
            </Button>
          </div>
        ) : null}
        <Datatable
          columns={tableColumns}
          rows={parseJson(data)}
          rowId={(row) => row.inspection_id}
        />
        <Modal open={modalIsOpen} onClose={() => closeModal()}>
          <InspectionForm closeModal={closeModal} />
        </Modal>
      </section>
    );
  }
};

export default Inspection;
