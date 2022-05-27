import { createContext, useState, useEffect } from 'react';
import { UseCurrentUser } from '../hooks/userQueries';
import { useNavigate } from 'react-router';

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentEmployeeRegion, setCurrentEmployeeRegion] = useState(null);
  const [currentEmployeePosition, setCurrentEmployeePosition] = useState(null);
  const { isLoading, data, isError, error } = UseCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem('temitope');

    if (token && data) {
      setCurrentEmployee(data.data['name']);
      setCurrentEmployeeId(data.data['employee_id']);
      setCurrentEmployeeRegion(data.data['region_name']);
      setCurrentEmployeePosition(data.data['position']);
    } else {
      // setCurrentEmployee(null);
      // setCurrentEmployeeId(null);
      // setCurrentEmployeeRegion(null);
      // localStorage.removeItem("temitope");
      // navigate("/login");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('temitope');
    setCurrentEmployee(null);
    setCurrentEmployeeId(null);
    setCurrentEmployeeRegion(null);
    navigate('/login');
  };

  const stateValues = {
    currentEmployee,
    setCurrentEmployee,
    currentEmployeeId,
    setCurrentEmployeeId,
    currentEmployeeRegion,
    setCurrentEmployeeRegion,
    handleLogout,
  };

  return (
    <CurrentUserContext.Provider value={stateValues}>
      {children}
    </CurrentUserContext.Provider>
  );
};
