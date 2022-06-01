import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import {
  useAddEmployeeData,
  useEditEmployeeData,
} from '../../hooks/employeeQueries';
import { useConstraints } from '../../hooks/useConstraints';
import {
  StyledTextField,
  StyledMenuItem,
} from '../../components/common/StyledTextField';
import { StyledFormBox } from '../../components/common/StyledFormBox';
import { StyledFormTitle } from '../../components/common/StyledFormTitle';
import Error from './../../components/error/Error';
import Loading from './../../components/loading/Loading';

const EmployeeForm = ({ closeModal, defaults, employeeId }) => {
  const formTitle = useRef('Registrer ny ansatt');
  const [employee, setEmployee] = useState({
    name: '',
    position: '',
    email: '',
    region_name: '',
    is_active: '',
  });

  useEffect(() => {
    if (defaults) {
      setEmployee(defaults);
      formTitle.current = 'Oppdater opplysninger';
    }
  }, []);

  const formik = useFormik({
    initialValues: employee,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (Object.values(values).every(Boolean)) {
        if (defaults) {
          editEmployee({ ...values, employeeId });
        } else {
          addEmployee({ ...values });
        }
        closeModal();
      } else {
        console.log('something is wrong');
      }
    },
  });

  const { data: constraints, isLoading, isError, error } = useConstraints();
  const { mutate: addEmployee } = useAddEmployeeData();
  const { mutate: editEmployee } = useEditEmployeeData();

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Error error={error} />;
  }

  return (
    <StyledFormBox>
      <StyledFormTitle variant='h6'>{formTitle.current}</StyledFormTitle>
      <form onSubmit={formik.handleSubmit}>
        <StyledTextField
          fullWidth
          variant='filled'
          id='name'
          name='name'
          label='Navn'
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='position'
          name='position'
          label='Stilling'
          value={formik.values.position}
          onChange={formik.handleChange}
          error={formik.touched.position && Boolean(formik.errors.position)}
          helperText={formik.touched.position && formik.errors.position}
        >
          {constraints.data['positions'].map((item) => {
            return (
              <StyledMenuItem key={item} value={item}>
                {item}
              </StyledMenuItem>
            );
          })}
        </StyledTextField>
        {!defaults ? (
          <StyledTextField
            fullWidth
            variant='filled'
            id='email'
            name='email'
            label='Email'
            type='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        ) : null}
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='region_name'
          name='region_name'
          label='Region'
          value={formik.values.region_name}
          onChange={formik.handleChange}
          error={
            formik.touched.region_name && Boolean(formik.errors.region_name)
          }
          helperText={formik.touched.region_name && formik.errors.region_name}
        >
          {constraints.data['regions'].map((item) => {
            return <StyledMenuItem value={item}>{item}</StyledMenuItem>;
          })}
        </StyledTextField>
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='is_active'
          name='is_active'
          label='Aktiv'
          value={formik.values.is_active}
          onChange={formik.handleChange}
          error={formik.touched.is_active && Boolean(formik.errors.is_active)}
          helperText={formik.touched.is_active && formik.errors.is_active}
        >
          {[
            ['Aktiv', true],
            ['Deaktivert', false],
          ].map((item) => {
            return (
              <StyledMenuItem key={item[1]} value={item[1]}>
                {item[0]}
              </StyledMenuItem>
            );
          })}
        </StyledTextField>
        <Button color='primary' variant='contained' fullWidth type='submit'>
          Submit
        </Button>
      </form>
    </StyledFormBox>
  );
};

export default EmployeeForm;
