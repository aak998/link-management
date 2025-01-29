import "./modulesCSS/mobdashboard.css";
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
  searchIccon,
} from "../data";
import { useState, useRef } from "react";
import Dashboard from "../component/dashboard";
import Setting from "../component/setting";
import Analytics from "../component/analyticsComp";
import LinkComponent from "../component/LinkComponent";
import Support from "../component/Support";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MobDashboardPage() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const fullName = localStorage.getItem("name");
  const name = fullName ? fullName.split(" ")[0] : null;
  const [search, setSearch] = useState('');


  const navigate = useNavigate();
  const popupRef = useRef(null);
  useEffect(()=>{
    
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login')
      }
  })

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard  />;
      case 'Settings':
        return <Setting />;
      case 'Link':
        return <LinkComponent search={search} />;
      case 'Analytics':
        return <Analytics />;
      case 'Support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours>= 5&& hours < 12) return "Good morning";
    if (hours>=12&& hours < 18) return "Good afternoon";
    if (hours>=18 &&hours < 21) return "Good evening";
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
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    setShowPopup(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  useEffect(() => {
    if (search.trim()) {
      setActiveComponent('Link'); 
    } 
  }, [search]);

  return (
    <div className="mobleDashboardContainer">
      <div className="mobDashboardNavbar">
        <div className="mobnavbar-top">
          <img
            src={MainLogo}
            className="MobDashboardMainLogo"
            alt="Main Logo"
          />
          <div className="mobgreeting-container">
            <span className="mobgreeting">
              🌞 {getGreeting()}, {name}
            </span>
            <span className="mobdate">{new Date().toDateString()}</span>
          </div>
        </div>
        <div className="mobnavbar-right">
          <button className="mobcreate-button" onClick={()=>navigate('/createlink')}>+ Create new</button>
          <img src={searchIccon} className="mobsearchIcon" alt="Search Icon" />
          <input
           type="text"
              value={search}
              placeholder="Search by remarks"
              className="mobsearch-bar"
              onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mobuser-initials" onClick={() => setShowPopup(true)}>
            {getInitials(name).toUpperCase()}
          </div>
        </div>
        <div className="mobnavbar-bottom">
          <nav className="mobdashboardLinks">
            <ul className="mobdashboardLinksList">
              <li
                className={
                  activeComponent === "Dashboard" ? "mobactive" : "mobDashboard"
                }
                onClick={() => setActiveComponent("Dashboard")}
              >
                <img
                  src={
                    activeComponent === "Dashboard"
                      ? activedashboardIcon
                      : dashboardIcon
                  }
                  alt="Dashboard Icon"
                  className="mobIconImg"
                />
                Dashboard
              </li>
              <li
                className={activeComponent === "Link" ? "mobactive" : "mobLink"}
                onClick={() => setActiveComponent("Link")}
              >
                <img
                  src={activeComponent === "Link" ? actvitelinkIcon : linkIcon}
                  alt="Link Icon"
                  className="mobIconImg"
                />
                Link
              </li>
              <li
                className={
                  activeComponent === "Analytics" ? "mobactive" : "mobAnalytics"
                }
                onClick={() => setActiveComponent("Analytics")}
              >
                <img
                  src={
                    activeComponent === "Analytics"
                      ? activeanaliticIcon
                      : analiticIcon
                  }
                  alt="Analytics Icon"
                  className="mobIconImg"
                />
                Analytics
              </li>
              <div className="mobsettinges">
               
                <li
                  className={activeComponent === "Settings" ? "mobactive" : ""}
                  onClick={() => setActiveComponent("Settings")}
                >
                  <img
                    src={
                      activeComponent === "Settings"
                        ? activesettingIcon
                        : settingIcon
                    }
                    alt="Settings Icon"
                    className="mobIconImg"
                  />
                  Settings
                </li>{" "}
              </div>
            </ul>
          </nav>
        </div>
      </div>
      {renderComponent()}
      {showPopup && (
        <div className="mobuser-popup" ref={popupRef}>
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
    </div>
  );
}

export default MobDashboardPage;