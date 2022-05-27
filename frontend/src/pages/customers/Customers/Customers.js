import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../../../context/UserContext';
import Modal from '../../../components/modal/Modal';
import CustomerForm from '../CustomerForm';
import Button from '@mui/material/Button';
import Datatable from '../../../components/datatable/Datatable';
import { useCustomersData } from '../../../hooks/customerQueries';
import Loading from '../../../components/loading/Loading';
import Error from '../../../components/error/Error';

import './customers.scss';

const Customers = () => {
  const { currentEmployeePosition } = useContext(CurrentUserContext);
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const { isLoading, data, isError, error, isSuccess } = useCustomersData();

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
    console.log(data);
    const tableColumns = [
      {
        field: 'name',
        headerName: 'Navn',
        flex: 1,
        sortable: true,
      },
      {
        field: 'street',
        headerName: 'Gatenavn',
        flex: 1,
        sortable: true,
      },
      {
        field: 'postal_code',
        headerName: 'Postkode',
        flex: 1,
        sortable: true,
      },
      {
        field: 'postal_name',
        headerName: 'Poststed',
        flex: 1,
        sortable: true,
      },
      {
        field: 'municipality',
        headerName: 'Kommune',
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
        field: 'open_projects',
        headerName: 'Inspeksjoner (pågår)',
        flex: 1,
        sortable: true,
      },
      {
        field: 'total_projects',
        headerName: 'Inspeksjoner (totalt)',
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
              <Link to={`/customers/${params.row.customer_id}`}>
                <div className='viewButton'>View</div>
              </Link>
            </div>
          );
        },
      },
    ];

    const rows = [];
    for (let key in data.data) {
      let customerData = data.data[key]['Customer'];
      let total_projects = data.data[key]['total_projects'];
      customerData['total_projects'] = data.data[key]['total_projects'];
      customerData['open_projects'] = data.data[key]['open_projects'];
      rows.push(customerData);
    }

    return (
      <div className='list-view-page' id='customers-page'>
        {currentEmployeePosition === 'Admin' || 'Serviceleder' ? (
          <div className='button-container'>
            <Button
              color='secondary'
              variant='contained'
              onClick={setModalIsOpen}
            >
              Legg til kunde
            </Button>
          </div>
        ) : null}
        <Datatable
          columns={tableColumns}
          rows={rows}
          rowId={(row) => row.customer_id}
        />
        <Modal open={ModalIsOpen} onClose={() => closeModal()}>
          <CustomerForm closeModal={closeModal} />
        </Modal>
      </div>
    );
  }
};

export default Customers;
