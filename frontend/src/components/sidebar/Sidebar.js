import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentUserContext } from '../../context/UserContext';
import './sidebar.scss';

const LinkItem = ({ url, text, icon }) => {
  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <li>
        {icon}
        <span>{text}</span>
      </li>
    </Link>
  );
};

const Sidebar = () => {
  const { handleLogout } = useContext(CurrentUserContext);
  return (
    <div className='sidebar'>
      <div className='top'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <p className='logo'>Kran-kontroll</p>
        </Link>
      </div>
      <hr />
      <div className='center'>
        <ul>
          <p className='title'>MAIN</p>
          <li>
            <DashboardIcon className='icon' />
            <span>Dashboard</span>
          </li>
          <p className='title'>LISTS</p>
          <LinkItem
            url='/employees'
            text='Ansatte'
            icon={<PersonOutlineIcon className='icon' />}
          />
          <LinkItem
            url='/customers'
            text='Kunder'
            icon={<StoreIcon className='icon' />}
          />
          <LinkItem
            url='/inspections'
            text='Inspeksjoner'
            icon={<LocalShippingIcon className='icon' />}
          />

          <p className='title'>USER</p>
          <li onClick={() => handleLogout()}>
            <ExitToAppIcon className='icon' />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
