import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { useEmployeeData } from './../../../hooks/employeeQueries';
import { useDeleteEmployeeData } from './../../../hooks/employeeQueries';
import EmployeeForm from './../EmployeeForm';
import Modal from '../../../components/modal/Modal';
import Loading from './../../../components/loading/Loading';
import Error from './../../../components/error/Error';
import Chart from './../../../components/chart/Chart';
import './employee-single.scss';

const EmployeeSingle = () => {
  const location = useLocation();
  const employeeId = location.pathname.split('/').pop();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, isError, data, error } = useEmployeeData(employeeId);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <div id='employee-single-page'>
      <div className='employee-details'>
        <h3 className='name'>{data?.data['name']}</h3>
        <p className='position'>{data?.data['position']}</p>
        <div className='info'>
          <EmailIcon />
          <p className='info-text'>{data?.data['email']}</p>
        </div>
        <div className='info'>
          <LocationOnIcon />
          <p className='info-text'>{data?.data['region_name']}</p>
        </div>
        <EditIcon className='edit-button' onClick={setIsOpen} />
      </div>
      <Modal open={isOpen} onClose={() => closeModal()}>
        <EmployeeForm
          closeModal={closeModal}
          defaults={{
            name: data.data['name'],
            position: data.data['position'],
            email: data.data['email'],
            region_name: data.data['region_name'],
          }}
          employeeId={employeeId}
        />
      </Modal>
      <Chart
        data={data?.data['assignments_count']}
        aspect={3.5 / 1}
        title='Inspeksjoner per år'
        width={'800px'}
      />
    </div>
  );
};

export default EmployeeSingle;
