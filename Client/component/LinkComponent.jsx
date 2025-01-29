import { useState, useEffect,useRef,useCallback } from "react";
import {
  EditIcon,
  CopyIcon,
  DeleteIcon,
  AscendingSortIcon,
  DescendingSortIcon,
  CopiedIcon
  
} from "../data"; 

import "./moduledCSS/linkpage.css";
import { deleteLink, getallLinks,getDataByRemarks } from "../Sevices";
import { useNavigate } from "react-router-dom";
import Pagination from "./handlePagination";
function LinkComponent({search}) {
  const [links, setLinks] = useState([]);
  const popupRef = useRef(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataexist, setDataexist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showPopup, setShowPopup] = useState(false); 
  const [showPopup2, setShowPopup2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const abortControllerRef = useRef(null)
  const debounceTimerRef = useRef(null)

 const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getLinks = async () => {
    setLoading(true);
    try {
      const response = await getallLinks({
        page: offset,
        limit,
      });

      const data = await response.json();
      setLinks(data.links);
      setTotalPages(data.totalPages);
      setDataexist(data.links.length > 0);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const seeachData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      console.log("API Call Triggered");
      const response = await getDataByRemarks({
        page: offset,
        limit,
        comments: search,
        signal, // Pass the abort signal
      });
      const data = await response.json();
      setLinks(data.links);
      setTotalPages(data.totalPages);
      setDataexist(data.links.length > 0);    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching links:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [offset, limit, search]);

  const debouncedFetchLinks = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      seeachData(); 
    }, 300);
  }, [seeachData]);

  useEffect(() => {
    if (search.length > 0) {
      debouncedFetchLinks();
    } else {
      getLinks(); 
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [limit, offset, search, debouncedFetchLinks]);

  const handleSort = (column, ascending) => {
    if (column === "status") {
      const sortedLinks = [...links].sort((a, b) => {
        const aStatus = a.linkExpiration && new Date(a.linkExpirationDate) <= Date.now() ? "Inactive" : "Active";
        const bStatus = b.linkExpiration && new Date(b.linkExpirationDate) <= Date.now() ? "Inactive" : "Active";
  
        if (ascending) {
          return aStatus === bStatus ? 0 : aStatus === "Active" ? -1 : 1;
        } else {
          return aStatus === bStatus ? 0 : aStatus === "Active" ? 1 : -1;
        }
      });
      setLinks(sortedLinks);
    } else {
      const sortedLinks = [...links].sort((a, b) =>
        ascending
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column])
      );
      setLinks(sortedLinks);
    }
  };
  
  
  

  const handlePagination = (newOffset) => {
    if (newOffset >= 1 && newOffset <= totalPages) {
      setOffset(newOffset);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1000);
  };

  const handleDeleteclick = (id) => {
    setDeleteId(id);
    setShowPopup2(true);
  };

  const handleDeleteLink = async() => {
    const response = await deleteLink(deleteId);
    if (response.ok) {
      getLinks();
    }

    setShowPopup2(false);
  };

  const handleEditclick = (id) => {
    const encodedId = btoa(id);
    navigate(`/editlink/${encodedId}`);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="link-table-container">
      {loading ? (
        <p>Loading{dots}</p>
      ) : dataexist ? (
        <>
          <div className="responseTable">
            <div className="responseTableHeader">
              <div className="tablehead">
                <span className="responsedatehead">Date</span>
                <span className="image">
                  <img
                    src={AscendingSortIcon}
                    onClick={() => handleSort("updatedAt", true)}
                  />
                  <img
                    src={DescendingSortIcon}
                    onClick={() => handleSort("updatedAt", false)}
                  />
                </span>
              </div>
              <div className="tablehead">
                <span className="OriginalLink">Original Link</span>
              </div>
              <div className="tablehead">
                <span className="ShortLink">Short Link</span>
              </div>
              <div className="tablehead">
                <span className="remarks">Remarks</span>
              </div>
              <div className="tablehead">
                <span className="clicks">Clicks</span>
              </div>
              <div className="tablehead">
                <span className="status">Status</span>
                <span className="image">
                  <img
                    src={AscendingSortIcon}
                    onClick={() => handleSort("status", true)}
                  />
                  <img
                    src={DescendingSortIcon}
                    onClick={() => handleSort("status", false)}
                  />
                </span>
              </div>
              <div className="tablehead">
                <span className="action">Action</span>
              </div>
            </div>
            <div className="responseTableBody">
              {links.map((link) => {
                let isActive = !link.linkExpiration;
                if (!isActive) {
                  let date = new Date(link.linkExpirationDate);
                  isActive = date.getTime() > Date.now();
                }





                return (
                  <div key={link._id} className="responseTableData">
                    <div className="tabledata">
                      <span className="responsedate">{link.updatedAt}</span>
                    </div>
                    <div className="tabledata">
                      <span className="OriginalLink">
                        {link.destinationUrl.length > 18
                          ? link.destinationUrl.slice(0, 18)
                          : link.destinationUrl}
                      </span>
                    </div>
                    <div className="tabledata">
                      <span className="ShortLink">
                        {link.shortUrl.length > 15
                          ? link.shortUrl.slice(0, 15)
                          : link.shortUrl}
                        <span onClick={() => copyToClipboard(link.shortUrl)}>
                          <img src={CopyIcon} />
                        </span>
                      </span>
                    </div>
                    <div className="tabledata">
                      <span className="remarks">{link.comments.length > 1
                          ? link.comments.slice(0, 14)
                          : link.comments}</span>
                    </div>
                    <div className="tabledata">
                      <span className="clicksdata">{link.clickCount}</span>
                    </div>
                    <div className="tabledata">
                      <span
                        className={isActive ? "active-status" : "inactive-status"}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="tabledata">
                      <span className="action">
                        <span onClick={() => handleEditclick(link._id)}>
                          <img src={EditIcon} />
                        </span>
                        <span onClick={() => handleDeleteclick(link._id)}>
                          <img src={DeleteIcon} />
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Pagination offset={offset} totalPages={totalPages} handlePagination={handlePagination} />
        </>
      ) : (
        <p></p>
      )}
      {showPopup && <div className="popup"><img src={CopiedIcon} />Link Copied </div>}
      {showPopup2 && (
        <div className="setting-popup-overlay">
          <div className="setting-popup" ref={popupRef}>
            <button className="setting-close-button" onClick={() => setShowPopup2(false)}>
              ×
            </button>
            <p> Are you sure, you want to remove it ? </p>
            <div className="setting-popup-buttons">
              <button
                className="setting-cancel-button"
                onClick={() => setShowPopup2(false)}
              >
                No
              </button>
              <button className="setting-confirm-button" onClick={handleDeleteLink}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    
  );
}

export default LinkComponent;