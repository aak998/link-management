import { useEffect, useState } from "react";
import { totalClicks, devicewiseClicks, datewiseClickes } from "../Sevices";
import "./moduledCSS/dash.css";



function Dashboard() {
  const [totalClick, setTotalClick] = useState(0);
  const [devicewise, setDevicewise] = useState([]);
  const [datewise, setDatewise] = useState([]);
  const [dataexist, setDataexist] = useState(true);
  const [loading, setLoading] = useState(true); 
  const [dots, setDots] = useState(""); 
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + "."; 
        } else {
          return ".";
        }
      });
    }, 500); 

    return () => clearInterval(interval); 
  }, []);

  const getTotalClick = async () => {
    const res = await totalClicks();
    const data = await res.json();
    setTotalClick(data.overallTotalClicks);
    setDataexist(data.overallTotalClicks > 0);
  };

  const getDevicewise = async () => {
    const res = await devicewiseClicks();
    const data = await res.json();
    const sortedDevicewise = data.clicks
      .map((item) => ({
        ...item,
        _id: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks);

    setDevicewise(sortedDevicewise);
  };

  const getDatewise = async () => {
    const res = await datewiseClickes();
    const data = await res.json();
    setDatewise(data.cumulativeClickData.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDatewise();
      await getTotalClick();
      await getDevicewise();
      setLoading(false); 
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {loading ? (
        <p>Loading{dots}</p> 
      ) : dataexist ? (
        <>
          <h1>
            Total Clicks <span>{totalClick}</span>
          </h1>

          <div className="dashboard-stats">
            <div className="datewise-section">
              <h3>Date-wise Clicks</h3>
              {datewise.map((item) => (
                <div className="datewise-item" key={item.date}>
                  <span>{item.date}</span>
                  <div className="progress-bar">
                    <div
                      className="fill"
                      style={{
                        width: `${(item.totalClicks / totalClick) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p>{item.totalClicks}</p>
                </div>
              ))}
            </div>

            <div className="devicewise-section">
              <h3>Click Devices</h3>
              {devicewise.map((item) => (
                <div className="devicewise-item" key={item._id}>
                  <p>{item._id}</p>
                  <div className="progress-bar">
                    <div
                      className="fill"
                      style={{
                        width: `${(item.totalClicks / devicewise[0].totalClicks) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span>{item.totalClicks}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p></p> 
      )}
    </div>
  );
}

export default Dashboard;