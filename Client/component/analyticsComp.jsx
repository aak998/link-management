import { getResponces } from "../Sevices"
import { useState, useEffect } from "react"
import Pagination from "./handlePagination";
import { AscendingSortIcon, DescendingSortIcon } from "../data";
import './moduledCSS/analysis.css'

function Analytics() {
  const [response, setResponse] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataexist, setDataexist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const fetchResponces = async () => {
    setLoading(true);
    try {
      const responces = await getResponces({
        page: offset,
        limit,
      });
      const data = await responces.json();
      setResponse(data.data);
      setTotalPages(data.totalPages);
      setDataexist(data.data.length > 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponces();
  }, [limit, offset]);

  const handlePagination = (newOffset) => {
    if (newOffset >= 1 && newOffset <= totalPages) {
      setOffset(newOffset);
    }
  };

  const handleSort = (direction) => {
    setSortDirection(direction);
    const sortedData = [...response];
    if (direction === "ascending") {
      sortedData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    } else if (direction === "descending") {
      sortedData.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
    }
    setResponse(sortedData);
  };

  return (
    <div className="responseContainer">
      {loading ? (
        <p>Loading{dots}</p>
      ) : dataexist ? (
        <>
          <div className="linkTable">
            <div className="linkTableHeader">
              <div className="linktablehead">
                <span className="linkresponsedatehead">Timestamp</span>
                <span className="image">
                  <img
                    src={AscendingSortIcon}
                    onClick={() => handleSort("ascending")}
                    className={sortDirection === "ascending" ? "activeSort" : ""}
                  />
                  <img
                    src={DescendingSortIcon}
                    onClick={() => handleSort("descending")}
                    className={sortDirection === "descending" ? "activeSort" : ""}
                  />
                </span>
              </div>
              <div className="linktablehead">
                <span className="linkOriginalLink">Original Link</span>
              </div>
              <div className="linktablehead">
                <span className="linkShortLink">Short Link</span>
              </div>
              <div className="linktablehead">
                <span className="ipaddress">ip address</span>
              </div>
              <div className="linktablehead">
                <span className="userDevices">User Device</span>
              </div>
            </div>
            <div className="linkresponseTableBody">
              {response.map((item, index) => (
                <div className="linkTableRow" key={index}>
                  <div className="linkTableCell">{item.Timestamp}</div>
                  <div className="linkTableCell">
                    {item.OriginalLink.length > 18
                      ? item.OriginalLink.slice(0, 18)
                      : item.OriginalLink}
                  </div>
                  <div className="linkTableCell">
                    {item.ShortLink.length > 18
                      ? item.ShortLink.slice(0, 18)
                      : item.ShortLink}
                  </div>
                  <div className="linkTableCell">{item.IPAddress}</div>
                  <div className="linkTableCell">{item.UserDevice}</div>
                </div>
              ))}
            </div>
          </div>

          <Pagination offset={offset} totalPages={totalPages} handlePagination={handlePagination} />
        </>
      ) : (
        <p>No Data Available</p>
      )}
    </div>
  );
}

export default Analytics;