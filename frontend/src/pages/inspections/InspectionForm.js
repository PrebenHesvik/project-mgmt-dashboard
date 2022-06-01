import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  useAddInspectionData,
  useEditInspectionData,
} from './../../hooks/InspectionQueries';
import { useConstraints } from '../../hooks/useConstraints';
import { StyledFormBox } from '../../components/common/StyledFormBox';
import { StyledFormTitle } from '../../components/common/StyledFormTitle';
import Button from '@mui/material/Button';
import {
  StyledTextField,
  StyledMenuItem,
} from './../../components/common/StyledTextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Loading from './../../components/loading/Loading';
import Error from './../../components/error/Error';

const InspectionForm = ({ closeModal, defaults, inspectionId }) => {
  const formTitle = useRef('Registrer ny inspeksjon');
  const { data: constraints, isLoading, isError, error } = useConstraints();
  const { mutate: addInspection } = useAddInspectionData();
  const { mutate: editInspection } = useEditInspectionData();
  const [inspection, setInspection] = useState({
    customer_id: '',
    description: '',
    status: '',
    inspection_year: '',
    inspection_month: '',
  });

  const thisYear = new Date().getFullYear();

  const months = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  useEffect(() => {
    if (defaults) {
      setInspection(defaults);
      formTitle.current = 'Oppdater opplysninger';
    }
  }, []);

  const formik = useFormik({
    initialValues: inspection,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (Object.values(values).every(Boolean)) {
        if (defaults) {
          editInspection({ ...values, inspectionId });
        } else {
          addInspection({ ...values });
        }
        closeModal();
      }
    },
  });

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Error error={error} />;
  }

  return (
    <>
      <StyledFormBox>
        <StyledFormTitle variant='h6'>{formTitle.current}</StyledFormTitle>
      </StyledFormBox>
      <form onSubmit={formik.handleSubmit}>
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='customer_id'
          name='customer_id'
          label='Kunde'
          value={formik.values.customer_id}
          onChange={formik.handleChange}
          error={
            formik.touched.customer_id && Boolean(formik.errors.customer_id)
          }
          helperText={formik.touched.customer_id && formik.errors.customer_id}
        >
          {constraints.data['customers'].map((customer) => {
            return (
              <StyledMenuItem
                key={customer['customer_id']}
                value={customer['customer_id']}
              >
                {customer['name']}
              </StyledMenuItem>
            );
          })}
        </StyledTextField>
        <StyledTextField
          fullWidth
          variant='filled'
          id='description'
          name='description'
          label='Beskrivelse'
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='status'
          name='status'
          label='Status'
          value={formik.values.status}
          onChange={formik.handleChange}
          error={formik.touched.status && Boolean(formik.errors.status)}
          helperText={formik.touched.status && formik.errors.status}
        >
          {constraints.data['wo_status'].map((status) => {
            return (
              <StyledMenuItem key={status} value={status}>
                {status}
              </StyledMenuItem>
            );
          })}
        </StyledTextField>
        <FormControl>
          <FormLabel id='radio-year'>Velg år</FormLabel>
          <RadioGroup
            aria-labelledby='radio-year'
            defaultValue={thisYear}
            name='inspection_year'
            value={formik.values.inspection_year}
            onChange={formik.handleChange}
            row
          >
            {[thisYear, thisYear + 1].map((value) => {
              return (
                <FormControlLabel
                  value={value}
                  control={<Radio />}
                  label={value}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        <StyledTextField
          fullWidth
          select
          variant='filled'
          id='inspection_month'
          name='inspection_month'
          label='Måned'
          value={formik.values.inspection_month}
          onChange={formik.handleChange}
          error={
            formik.touched.inspection_month &&
            Boolean(formik.errors.inspection_month)
          }
          helperText={
            formik.touched.inspection_month && formik.errors.inspection_month
          }
        >
          {months.map((month) => {
            return (
              <StyledMenuItem key={month} value={month}>
                {month}
              </StyledMenuItem>
            );
          })}
        </StyledTextField>

        <Button color='primary' variant='contained' fullWidth type='submit'>
          Submit
        </Button>
      </form>
    </>
  );
};

export default InspectionForm;
