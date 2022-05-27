import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import { useConstraints } from '../../hooks/useConstraints';
import {
  useAddCustomerData,
  useEditCustomerData,
} from '../../hooks/customerQueries';
import {
  StyledTextField,
  StyledMenuItem,
} from '../../components/common/StyledTextField';
import { StyledFormBox } from '../../components/common/StyledFormBox';
import { StyledFormTitle } from '../../components/common/StyledFormTitle';

const CustomerForm = ({ closeModal, defaults, customerId }) => {
  const formTitle = useRef('Registrer ny kunde');
  const { data: constraints, isLoading, isError, error } = useConstraints();
  const { mutate: addCustomer } = useAddCustomerData();
  const { mutate: editCustomer } = useEditCustomerData();
  const [customer, setCustomer] = useState({
    name: '',
    street: '',
    postal_code: '',
    postal_name: '',
    municipality: '',
    region_name: '',
    is_active: '',
  });

  useEffect(() => {
    if (defaults) {
      setCustomer(defaults);
      formTitle.current = 'Oppdater opplysninger';
    }
  }, []);

  const formik = useFormik({
    initialValues: customer,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (Object.values(values).every(Boolean)) {
        if (defaults) {
          editCustomer({ ...values, customerId });
        } else {
          addCustomer({ ...values });
        }
        closeModal();
      } else {
        console.log(values);
        console.log('something is wrong');
      }
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
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
          variant='filled'
          id='street'
          name='street'
          label='Gate'
          value={formik.values.street}
          onChange={formik.handleChange}
          error={formik.touched.street && Boolean(formik.errors.street)}
          helperText={formik.touched.street && formik.errors.street}
        />
        <StyledTextField
          fullWidth
          variant='filled'
          id='postal_code'
          name='postal_code'
          label='Postkode'
          value={formik.values.postal_code}
          onChange={formik.handleChange}
          error={
            formik.touched.postal_code && Boolean(formik.errors.postal_code)
          }
          helperText={formik.touched.postal_code && formik.errors.postal_code}
        />
        <StyledTextField
          fullWidth
          variant='filled'
          id='postal_name'
          name='postal_name'
          label='Poststed'
          value={formik.values.postal_name}
          onChange={formik.handleChange}
          error={
            formik.touched.postal_name && Boolean(formik.errors.postal_name)
          }
          helperText={formik.touched.postal_name && formik.errors.postal_name}
        />
        <StyledTextField
          fullWidth
          variant='filled'
          id='municipality'
          name='municipality'
          label='Kommune'
          value={formik.values.municipality}
          onChange={formik.handleChange}
          error={
            formik.touched.municipality && Boolean(formik.errors.municipality)
          }
          helperText={formik.touched.municipality && formik.errors.municipality}
        />
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
            return (
              <StyledMenuItem key={item} value={item}>
                {item}
              </StyledMenuItem>
            );
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

export default CustomerForm;
