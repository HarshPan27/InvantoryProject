import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "Employee");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [changeRequests, setChangeRequests] = useState({});

  const storedEmployeeId = localStorage.getItem("employeeId"); // ✅ Correct usage
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📢 Fetching Inventory...");
    
    axios.get("http://localhost:5001/api/inventory")
      .then(response => {
        console.log(" Inventory Data Received:", response.data);
        setInventory(response.data || []);
      })
      .catch(error => {
        console.error(" Error fetching inventory:", error.response?.data || error.message);
      });
  }, []);
  useEffect(() => {
    if (!storedEmployeeId || !isValidObjectId(storedEmployeeId)) {
      console.error(" Invalid or missing Employee ID:", storedEmployeeId);
      return; // Stop execution if employeeId is not valid
    }

    console.log("📢 Fetching tasks for Employee ID:", storedEmployeeId);

    axios.get(`http://localhost:5001/api/tasks/${storedEmployeeId}`)
      .then((res) => {
        console.log(" Tasks fetched:", res.data);
        setTasks(res.data || []);
      })
      .catch((err) => console.error("❌ Error fetching tasks:", err.response?.data || err));

    axios.get(`http://localhost:5001/api/schedule/${storedEmployeeId}`)
      .then(response => {
        console.log(" Schedule fetched:", response.data);
        setSchedule(response.data || []);
      })
      .catch(error => console.error("❌ Error fetching schedule:", error.response?.data || error.message));

  }, [storedEmployeeId]);

  const markAsCompleted = async (taskId) => {
    try {
      await axios.patch(`http://localhost:5001/api/tasks/${taskId}`, { status: "Completed" });
  
      // ✅ Refresh tasks after updating
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "Completed" } : task
        )
      );
  
      console.log(` Task ${taskId} marked as completed!`);
    } catch (err) {
      console.error(" Error updating task:", err.response?.data || err);
    }
  };

  const handleRequestChange = (itemId) => {
    if (!changeRequests[itemId]) return;

    const requestData = {
      itemId,
      message: changeRequests[itemId],
      employee: username,
    };

    axios.post("http://localhost:5001/api/inventory/request-change", requestData)
      .then(() => {
        setChangeRequests(prevRequests => ({ ...prevRequests, [itemId]: "" }));
      })
      .catch(error => console.error(" Error submitting request:", error.response?.data || error));
  };

  return (
    <div className="employee-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">IntelliGrocer</h2>
        <ul className="sidebar-menu">
          <li className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li className={`nav-item ${activeSection === "tasks" ? "active" : ""}`} onClick={() => setActiveSection("tasks")}>Tasks</li>
          <li className={`nav-item ${activeSection === "inventory" ? "active" : ""}`} onClick={() => setActiveSection("inventory")}>Inventory</li>
          <li className={`nav-item ${activeSection === "schedule" ? "active" : ""}`} onClick={() => setActiveSection("schedule")}>Schedule</li>
          <li className="nav-item logout" onClick={() => {
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            navigate("/");
          }}>Logout</li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
<div className="dashboard-content">
  {activeSection === "dashboard" && (
    <>
      <h2 className="dashboard-title">Employee Dashboard</h2>
      <p className="welcome-text">Welcome, {username}!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card shadow-effect">
          <h3>Performance Metrics</h3>
          <p>Efficiency: 95%</p>
        </div>
        <div className="dashboard-card shadow-effect">
          <h3>Pending Tasks</h3>
          <p>{tasks.filter(task => task.status !== "Completed").length}</p> {/* ✅ Only show pending tasks */}
        </div>
        <div className="dashboard-card shadow-effect">
          <h3>Completed Tasks</h3>
          <p>{tasks.filter(task => task.status === "Completed").length}</p> {/* ✅ Track completed tasks */}
        </div>
      </div>
    </>
  )}
        

{activeSection === "tasks" && (
  <div className="dashboard-card shadow-effect">
    <h2>Your Tasks</h2>
    {tasks.length > 0 ? (
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.description}
            <p>Status: {task.status}</p>
            {task.status !== "Completed" && (
              <button onClick={() => markAsCompleted(task._id)}>✔ Mark as Completed</button>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No assigned tasks.</p>
    )}
  </div>
)}

        {activeSection === "schedule" && (
          <div className="dashboard-card shadow-effect">
            <h2>My Schedule</h2>
            {schedule.length > 0 ? (
              <ul>
                {schedule.map((shift, index) => (
                  <li key={index}>
                    <strong>{shift.shiftStart}</strong> to <strong>{shift.shiftEnd}</strong> - {shift.notes}
                  </li>
                ))}
              </ul>
            ) : <p>No schedule assigned yet.</p>}
          </div>
        )}

        {activeSection === "inventory" && (
          <div className="dashboard-card shadow-effect">
            <h2>Inventory Overview</h2>
            {inventory.length > 0 ? (
              <ul>
                {inventory.map((item) => (
                  <li key={item._id}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} />
                    {item.name} - ${item.price} - {item.quantity} in stock
                    <div>
                      <input
                        type="text"
                        placeholder="Request change..."
                        value={changeRequests[item._id] || ""}
                        onChange={(e) => setChangeRequests({ ...changeRequests, [item._id]: e.target.value })}
                      />
                      <button onClick={() => handleRequestChange(item._id)}>Request Change</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No inventory data available.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;