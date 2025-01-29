import './moduledCSS/dashboard.css';
import {
  settingIcon,
  dashboardIcon,
  MainLogo,
  analiticIcon,
  linkIcon,
  activeanaliticIcon,
  activedashboardIcon,
  activesettingIcon,
  actvitelinkIcon,
  searchIccon
} from '../data';
import { useState, useRef, useEffect } from 'react';
import Dashboard from '../component/dashboard';
import Setting from '../component/setting';
import Analytics from '../component/analyticsComp';
import LinkComponent from '../component/LinkComponent';
import Support from '../component/Support'; 
import { useNavigate } from 'react-router-dom';
import { getUserName } from '../Sevices';

function DashboardPage() {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [showPopup, setShowPopup] = useState(false); 
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const popupRef = useRef(null); 
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getUser = async () => {
    const response = await getUserName();
    const data = await response.json();
    localStorage.setItem('name', data.name);
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard  />;
      case 'Settings':
        return <Setting />;
      case 'Link':
        return <LinkComponent search={search}/>;
      case 'Analytics':
        return <Analytics />;
      case 'Support':
        return <Support />;
      default:
        return <Dashboard  />;
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Good morning";
    if (hours >= 12 && hours < 18) return "Good afternoon";
    if (hours >= 18 && hours < 21) return "Good evening";
    return "Good night";
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0] + (parts[0][1] || "").toUpperCase();
    }
    return parts[0][0] + parts[1][0];
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    setShowPopup(false); 
    navigate('/login');
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setActiveComponent('Link'); 
    } 
  }, [search]);

  console.log(search)

  return (
    <div className="dashboardContainer">
      <div className='dashboardleftContainer'>
        <img src={MainLogo} className='dashboardMainLogo' alt="Main Logo" />

        <nav className='dashboardLinks'>
          <ul className='dashboardLinksList'>
            <li
              className={activeComponent === 'Dashboard' ? 'active' : 'Dashboard'}
              onClick={() => setActiveComponent('Dashboard')}
            >
              <img src={activeComponent === 'Dashboard' ? activedashboardIcon : dashboardIcon} alt="Dashboard Icon" className='IconImg' />
              Dashboard
            </li>
            <li
              className={activeComponent === 'Link' ? 'active' : 'Link'}
              onClick={() => setActiveComponent('Link')}
            >
              <img src={activeComponent === 'Link' ? actvitelinkIcon : linkIcon} alt="Link Icon" className='IconImg' />
              Link
            </li>
            <li
              className={activeComponent === 'Analytics' ? 'active' : 'Analytics'}
              onClick={() => setActiveComponent('Analytics')}
            >
              <img src={activeComponent === 'Analytics' ? activeanaliticIcon : analiticIcon} alt="Analytics Icon" className='IconImg' />
              Analytics
            </li>
            <div className='settinges'>
              <li
                className={activeComponent === 'Settings' ? 'active' : ''}
                onClick={() => setActiveComponent('Settings')}
              >
                <img src={activeComponent === 'Settings' ? activesettingIcon : settingIcon} alt="Settings Icon" className='IconImg' />
                Settings
              </li>
            </div>
          </ul>
        </nav>
      </div>
      <div className='dashboardrightContainer'>
        <div className="navbar">
          <div className="navbar-left">
            <span className="greeting">
              🌞 {getGreeting()}, {name}
            </span>
            <span className="date">{new Date().toDateString()}</span>
          </div>
          <div className="navbar-right">
            <button className="create-button" onClick={() => navigate('/createlink')}>+ Create new</button>
            <img src={searchIccon} className='searchIcon' />
            <input
              type="text"
              value={search}
              placeholder="Search by remarks"
              className="search-bar"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="user-initials" onClick={() => { setShowPopup(true) }}>{getInitials(name).toUpperCase()}</div>
          </div>
        </div>
        {renderComponent()}
      </div>
      {showPopup && (
        <div className="user-popup" ref={popupRef}>
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;