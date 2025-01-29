import { useState, useEffect } from "react";
import "./moduledCSS/ceatepage.css";
import { createLink } from "../Sevices";
import { useParams } from "react-router-dom";
import { getLinkByID } from "../Sevices";
import { editLinkData } from "../Sevices";
import { useNavigate } from "react-router-dom";


function CreateLinkPage() {
  const [formData, setFormData] = useState({
    destinationUrl: "",
    comments: "",
    linkExpiration: false,
    expirationDate: "",
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [error, setError] = useState("");
  const id = useParams().id;

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(()=>{
    const userexist=localStorage.getItem('token');
    if(!userexist){
      navigate('/login')
      }
  })

  const handleToggle = () => {
    setFormData({ ...formData, linkExpiration: !formData.linkExpiration });
  };

  // if the id is present in the url, fetch the link details
  const getUserDetail = async () => {
    const decodedId = atob(id);
    const response = await getLinkByID(decodedId);
    if (response.status === 200) {
      const data = await response.json();
      const expirationDate = new Date(data.link.expirationDate);

    const year = expirationDate.getFullYear();
    const month = String(expirationDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(expirationDate.getDate()).padStart(2, '0');
    const hours = String(expirationDate.getHours()).padStart(2, '0');
    const minutes = String(expirationDate.getMinutes()).padStart(2, '0');   
    const dateandtime = `${year}-${month}-${day}T${hours}:${minutes}`;
      setFormData({
        destinationUrl: data.link.destinationUrl,
        comments: data.link.comments,
        linkExpiration: data.link.linkExpiration,
        expirationDate: dateandtime,
      });
    }
  };


  useEffect(() => {
    if (id) {
      getUserDetail();
    }
  }, []);

  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      comments: "",
      linkExpiration: false,
      expirationDate: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.destinationUrl) {
      setError("This field is mandatory");
      return;
    }
    
    // Check if expiration date is required but not provided
    if (formData.linkExpiration && !formData.expirationDate) {
      setPopupMessage("Expiration date is required when link expiration is enabled.");
      setTimeout(() => {
        setPopupMessage("");
      }, 3000);
      return;
    }
  
    if (!id) {
      try {
        const response = await createLink(formData);
        if (response.status === 201) {
          setPopupMessage("Link Created Successfully");
          setTimeout(() => {
            setPopupMessage("");
          }, 3000);
          navigate('/login');
        }
        if (response.status === 400) {
          setPopupMessage("Expiration date must be in the future");
          setTimeout(() => {
            setPopupMessage("");
          }, 3000);
        }
        setFormData({
          destinationUrl: "",
          comments: "",
          linkExpiration: false,
          expirationDate: "",
        });
      } catch {
        setPopupMessage("Error creating link");
        setTimeout(() => {
          setPopupMessage("");
        }, 3000);
      }
    } else {
      try {
        const decodedId = atob(id);
  
        const response = await editLinkData(decodedId, formData);
        if (response.status === 200) {
          setPopupMessage("Link Updated Successfully");
          setTimeout(() => {
            setPopupMessage("");
          }, 3000);
          navigate('/dashboard');
        }
  
        if (response.status === 410) {
          setPopupMessage("Expiration date must be in the future");
          setTimeout(() => {
            setPopupMessage("");
          }, 3000);
        }
      } catch {
        setPopupMessage("Error updating link");
        setTimeout(() => {
          setPopupMessage("");
        }, 3000);
      }
    }
  
    
    setError("");
  };
  

  return (
    <div className="create-link-container">
      <div className="header">
        <h2>New Link</h2>
        <button className="close-button" onClick={() => window.history.back()}>
          ✖
        </button>
      </div>

      <div className="form-group-container">
        <div className="form-group">
          <label>
            Destination URL <span className="required">*</span>
          </label>
          <input
            type="text"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleInputChange}
            className={`input ${error ? "input-error" : ""}`}
            placeholder="https://web.whatsapp.com/"
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="form-group">
          <label>
            Remarks <span className="required">*</span>
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            className="textarea"
            placeholder="Add remarks"
          />
        </div>

        <div className="form-group">
          <div className="form-groupLink">
            <label className="form-label">Link Expiration</label>
            <div className="toggle-container" onClick={handleToggle}>
              <div
                className={`toggle ${
                  formData.linkExpiration ? "toggle-on" : "toggle-off"
                }`}
              ></div>
            </div>
          </div>
          {formData.linkExpiration && (
            <input
              type="datetime-local"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              className="input"
            />
          )}
        </div>

        <div className="button-group">
          <button onClick={handleClear} className="clear-button">
            Clear
          </button>
          <button onClick={handleSubmit} className="submit-button">
            Create New
          </button>
        </div>
      </div>
      {popupMessage && <div className="popupMessage">{popupMessage}</div>}
    </div>
  );
}

export default CreateLinkPage;