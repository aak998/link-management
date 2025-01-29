import  { useState, useRef, useEffect } from "react";
import "./moduledCSS/setting.css";
import { edituser,deleteuser } from "../Sevices";
import { useNavigate } from "react-router-dom";
 
function Setting() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();

  const handleSaveChanges = async() => {
    try{
      const response = await edituser(formData);
      const data=await response.json();
      if(response.status===200){
        setPopupMessage('Changes Saved Successfully');
        setTimeout(() => {
          setPopupMessage('');
          setFormData({name:"",email:"",mobile:""});
          }, 2000);
          localStorage.setItem('token',data.token);
          localStorage.setItem('name',data.name);
          if(formData.email.length>0){
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            navigate('/login');
            }
            window.location.reload();

          }


          if(response.status===400){
            setPopupMessage(data.message);
            setTimeout(() => {
              setPopupMessage('');
              }
              , 2000);
            }
           
          
          
    }
    catch{
      setPopupMessage('Failed to Save Changes');
      setTimeout(() => {
        setPopupMessage('');
        }
        , 2000);
      }
    setFormData({ name: "", email: "", mobile: "" });
  };

  const handleDeleteAccount = async() => {
    try{
      setShowPopup(false);
    const response = await deleteuser();
    if(response.status===200){
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      navigate('/login');
    }}
    catch{
      setPopupMessage('Failed to Delete Account');
      setTimeout(() => {
        setPopupMessage('');
        }
        , 2000);
        }
        
    
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="setting-container">
      <div className="setting-form-container">
        <div className="setting-form-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Rahul Singh"
          />
        </div>
        <div className="setting-form-field">
          <label htmlFor="email">Email id</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="rahulsingh@gmail.com"
          />
        </div>
        <div className="setting-form-field">
          <label htmlFor="mobile">Mobile no.</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="1234567890"
          />
        </div>
        <button className="setting-save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="setting-delete-button" onClick={() => setShowPopup(true)}>
          Delete Account
        </button>
      </div>

      {showPopup && (
        <div className="setting-popup-overlay">
          <div className="setting-popup" ref={popupRef}>
            <button className="setting-close-button" onClick={() => setShowPopup(false)}>
              ×
            </button>
            <p> Are you sure, you want to delete the account ? </p>
            <div className="setting-popup-buttons">
              <button
                className="setting-cancel-button"
                onClick={() => setShowPopup(false)}
              >
                No
              </button>
              <button className="setting-confirm-button" onClick={handleDeleteAccount}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {popupMessage && (
                <div className='popupMessage'>
                    {popupMessage}
                </div>
            )}
    </div>
  );
}

export default Setting;