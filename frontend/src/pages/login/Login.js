import { useNavigate } from 'react-router';
import { fetchToken, setToken } from '../../utils/Auth';
import { useState, useContext } from 'react';
import axios from 'axios';
import qs from 'qs';
import { CurrentUserContext } from '../../context/UserContext';
import { useFormik } from 'formik';
import './login.scss';
import { Button } from '@mui/material';
import { StyledTextField } from './../../components/common/StyledTextField';

export default function Login() {
  const { setCurrentEmployeeId, setCurrentEmployee, setCurrentEmployeeRegion } =
    useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const submitLogin = async (user) => {
    const params = qs.stringify(user);

    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/login',
        params,
        headers
      );
      if (response.data.access_token) {
        setToken(response.data.access_token);
        setCurrentEmployeeId(response.data.employee.employee_id);
        setCurrentEmployee(response.data.employee.name);
        setCurrentEmployeeRegion(response.data.employee.region_name);
        navigate('/inspections');
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const formik = useFormik({
    initialValues: user,
    onSubmit: (values) => {
      if (Object.values(values).every(Boolean)) {
        submitLogin({ ...values });
      }
    },
  });

  return (
    <div id='login-form-container'>
      {fetchToken() !== null ? (
        <p>you are logged in</p>
      ) : (
        <form id='login-form' onSubmit={formik.handleSubmit}>
          <h1 className='login-title'>Velkommen</h1>
          <StyledTextField
            fullWidth
            variant='filled'
            id='username'
            name='username'
            label='Beskrivelse'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <StyledTextField
            fullWidth
            variant='filled'
            id='password'
            name='password'
            label='Beskrivelse'
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color='primary' variant='contained' fullWidth type='submit'>
            Logg inn
          </Button>
        </form>
      )}
    </div>
  );
}
