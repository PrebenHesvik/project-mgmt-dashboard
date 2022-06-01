//import "./style/css//css/App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CurrentUserProvider } from './context/UserContext';
import Employees from './pages/employees/Employees/Employees';
import EmployeeSingle from './pages/employees/EmployeeSingle/EmployeeSingle';
import Inspections from './pages/inspections/Inspections/Inspections';
import Customers from './pages/customers/Customers/Customers';
import SharedLayout from './pages/sharedLayout/SharedLayout';
import Login from './pages/login/Login';
import CustomerSingle from './pages/customers/CustomerSingle/CustomerSingle';
import InspectionSingle from './pages/inspections/InspectionSingle/InspectionSingle';

function App() {
  return (
    <BrowserRouter>
      <CurrentUserProvider>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route path='employees'>
              <Route index element={<Employees />} />
              <Route path=':employeeId' element={<EmployeeSingle />} />
            </Route>
            <Route path='customers'>
              <Route index element={<Customers />} />
              <Route path=':customerId' element={<CustomerSingle />} />
            </Route>
            <Route path='inspections'>
              <Route index element={<Inspections />} />
              <Route path=':inspectionId' element={<InspectionSingle />} />
            </Route>
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </CurrentUserProvider>
    </BrowserRouter>
  );
}

export default App;
