
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
const [newAdminUser, setNewAdminUser] = useState("");
const [activePage, setActivePage] = useState("dashboard");
const [assetSuggestions, setAssetSuggestions] = useState([]);
const [locationSuggestions, setLocationSuggestions] = useState([]);
const [activeFilter, setActiveFilter] = useState("");
const [showHelpDesk, setShowHelpDesk] = useState(false);
const [searchSuggestions, setSearchSuggestions] = useState([]);
const [showSplash, setShowSplash] = useState(true);
const [newAdminPass, setNewAdminPass] = useState("");
const [excelFile, setExcelFile] = useState(null);
const [loading, setLoading] = useState(true);
const [section, setSection] = useState("");
const [sectionSuggestions, setSectionSuggestions] = useState([]);
const [gear, setGear] = useState("");
const telecomAssets = [
  "OFC Cable cut",
  "Equipment failure",
  "RCIL issue",
  "Network failure",
  "Internet fail",
  "Cable cut",
  "Cable def",
  "OFC cut",
  "Gear failure",
  "E1 Issue",
  "Weighment failure",
"Router failure",
"Switch failure",
"SCADA communication loss",
"FOIS connectivity issue"
];
const telecomLocations = [
  "MBW",
  "SONU",
  "BME",
  "NAC",
  "GOTN",
  "MCPE",
  "JU",
  "JSM",
  "MTD",
  "BKN"
];
const sectionList = [
  "JU-MTD",
  "MTD-BKN",
  "RKB-JSM",
  "SMR-BLDI",
  "SMR-MBF",
  "MTD-FL",
  "JU-BKN",
  "JU-JSM",
];
const fetchFailures = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
  "https://railway-telecom-backend.onrender.com/api/failures"
);

    setFailures(res.data.reverse());

    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
const fetchAdmins = async () => {
  try {
    const res = await axios.get(
  "https://railway-telecom-backend.onrender.com/api/admins"
);

    setAdmins(res.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchFailures();
   fetchAdmins();
  
}, []);


const [admins, setAdmins] = useState([]);

 const [adminName, setAdminName] = useState("");
 const [showLogin, setShowLogin] = useState(false);
const [username, setUsername] = useState("");
const [showSettings, setShowSettings] = useState(false);
const [darkMode, setDarkMode] = useState(true);
useEffect(() => {
  if (darkMode) {
    document.body.style.background = `
      radial-gradient(circle at top left,
      rgba(56,189,248,0.18),
      transparent 35%),
      radial-gradient(circle at bottom right,
      rgba(139,92,246,0.12),
      transparent 35%),
      #07111F
    `;
  } else {
    document.body.style.background = "#f1f5f9";
  }
}, [darkMode]);
useEffect(() => {
  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 3000);

  return () => clearTimeout(timer);
}, []);
const [password, setPassword] = useState("");
  const [asset, setAsset] = useState("");
const [location, setLocation] = useState("");
const [selectedFailure, setSelectedFailure] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
  const [failures, setFailures] = useState([]);
const totalFailures = failures.length;

const resolvedCount = failures.filter(
  (f) => f.status === "Resolved"
).length;

const openCount = failures.filter(
  (f) => f.status === "Open"
).length;


const scadaCount = failures.filter(
  (f) => f.gear === "SCADA"
).length;

const controlCount = failures.filter(
  (f) => f.gear === "Control"
).length;

const foisCount = failures.filter(
  (f) => f.gear === "FOIS"
).length;
const filteredFailures = failures.filter((failure) =>
  `${failure.title ?? ""} ${failure.location ?? ""} ${
    failure.gear?? ""
  } ${failure.status ?? ""}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
const suggestions = [
  "SCADA",
  "Control",
  "FOIS",
  "Open",
  "In Progress",
  "Resolved",
];
const adminLogin = () => {
  const username = prompt("Enter Username");

  if (username === null) return;

  const password = prompt("Enter Password");

  if (password === null) return;

 const admin = admins.find(
  (a) =>
    a.username === username &&
    a.password === password
);

if (admin) {
  setIsAdmin(true);
  setAdminName(admin.username);
  setShowLogin(false);
  alert("Login Successful");
} else {
  alert("Wrong Username or Password");
}
};
const addAdmin = async () => {
  if (!newAdminUser || !newAdminPass) {
    alert("Fill all fields");
    return;
  }

  try {
    await axios.post(
      "https://railway-telecom-backend.onrender.com/api/admins",
      {
        username: newAdminUser,
        password: newAdminPass,
      }
    );

    fetchAdmins();

    setNewAdminUser("");
    setNewAdminPass("");

    alert("Admin Added Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to Add Admin");
  }
};
const deleteAdmin = async (id) => {
  try {
    await axios.delete(
      `https://railway-telecom-backend.onrender.com/api/admins/${id}`
    );

    setAdmins(
      admins.filter(
        (admin) => admin._id !== id
      )
    );

    alert("Admin Deleted");
  } catch (error) {
    console.log(error);
  }
};

const addFailure = async () => {
  if (!asset || !location || !section || !gear) {
    alert("Please fill all fields");
    return;
  }

  try {
    const randomDays =
  Math.floor(Math.random() * 2) + 3;

const expectedClosingDate =
  new Date();

expectedClosingDate.setDate(
  expectedClosingDate.getDate() +
    randomDays
);
   await axios.post(
  "https://railway-telecom-backend.onrender.com/api/failures",
 {
  title: asset,
  location,
  section,
  gear,
    closingDate:
          expectedClosingDate
            .toISOString()
            .split("T")[0],
    status: "Open",
  }
);

    fetchFailures();

   setAsset("");
setLocation("");
setSection("");
setGear("");

    alert("Failure Added Successfully");
  } catch (error) {
    console.error(error);
    alert("Error Adding Failure");
  }
};
const uploadExcel = async () => {
  if (!excelFile) {
    alert("Select an Excel File");
    return;
  }

  const formData = new FormData();
  formData.append("file", excelFile);

  try {
    const res = await axios.post(
      "https://railway-telecom-backend.onrender.com/api/failures/upload-excel",
      formData
    );

    alert(
      `${res.data.count} Failures Imported Successfully`
    );

    fetchFailures();
  } catch (error) {
    console.error(error);
    alert("Excel Upload Failed");
  }
};
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Telecom Failure Report", 14, 20);

autoTable(doc, {
  startY: 30,
 head: [[
  "SN",
  "Station",
  "Section",
  "Date",
  "Closing Date",
  "Main Cause",
  "Gear",
  "Status"
]],
 body: failures.map((failure, index) => [
  index + 1,
  failure.location,
  failure.section,
  new Date(failure.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ),
  failure.closingDate
    ? new Date(failure.closingDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "-",
  failure.title,
  failure.gear,
  failure.status,
]),
});

  doc.save("Telecom_Failure_Report.pdf");
};
const downloadExcel = () => {
  const excelData = failures.map(
  (failure, index) => ({
    SN: index + 1,
    Station: failure.location,
    Section: failure.section,
    Date: new Date(
      failure.createdAt
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ),

    "Closing Date": failure.closingDate
      ? new Date(
          failure.closingDate
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "-",

    "Main Cause": failure.title,
    Gear: failure.gear,
    Status: failure.status,
  })
);

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Failures"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    fileData,
    "Railway_Failure_Report.xlsx"
  );
};
 const deleteFailure = async (id) => {
  try {
    await axios.delete(
      `https://railway-telecom-backend.onrender.com/api/failures/${id}`
    );

    fetchFailures();

    alert("Failure Deleted");
  } catch (error) {
    console.error(error);
    alert("Delete Failed");
  }
};
const updateStatus = async (id) => {
  try {
    await axios.put(
      `https://railway-telecom-backend.onrender.com/api/failures/${id}`
    );

    fetchFailures();
  } catch (error) {
    console.error(error);
    alert("Update Failed");
  }
};

const pieData = [
  { name: "SCADA", value: scadaCount },
  { name: "Control", value: controlCount },
  { name: "FOIS", value: foisCount },
];
 const assetCounts = {};

failures.forEach((failure) => {
  assetCounts[failure.title] =
    (assetCounts[failure.title] || 0) + 1;
});
const shortAssetName = (asset) => {
  switch (asset) {
    case "Joint Closure":
      return "Joint";

    case "Signal Cable":
      return "Signal";

    case "Control Cable":
      return "Control";

    case "Power Cable":
      return "Power";

    case "Fiber Patch Cord":
      return "Fiber";

    default:
      return asset;
  }
};

const barData = Object.keys(assetCounts).map(
  (asset) => ({
    asset: shortAssetName(asset),
    failures: assetCounts[asset],
  })
);
const locationCounts = {};

failures.forEach((failure) => {
  locationCounts[failure.location] =
    (locationCounts[failure.location] || 0) + 1;
});

const topLocations = Object.entries(locationCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
const recentFailures = [...failures]
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .slice(0, 5);
const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4"];
if (showSplash) {
  return (
    <div className="premium-splash">
      <div className="premium-overlay">
        
      <div className="loading-wrapper">
        <div className="loading-container">
          <div className="loading-fill"></div>
        </div>
        <div className="loading-text">
  Loading Dashboard...
</div>
      </div>



      </div>
    </div>
  );
}
   
  return (
    <div
  className={`container ${
    darkMode
      ? "dark-theme"
      : "light-theme"
  }`}
>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          🚆
          <h2>Telecom</h2>
        </div>

        <ul>
          <li
  onClick={() =>
    document
      .getElementById("dashboard-section")
      .scrollIntoView({ behavior: "smooth" })
  }
  style={{ cursor: "pointer" }}
>
  📊 Dashboard
</li>
          <li
  onClick={() =>
    document
      .getElementById("failure-section")
      .scrollIntoView({ behavior: "smooth" })
  }
  style={{ cursor: "pointer" }}
>
  ⚠ Failures
</li>
          <li
  onClick={() =>
    document
      .getElementById("report-section")
      .scrollIntoView({ behavior: "smooth" })
  }
  style={{ cursor: "pointer" }}
>
  📄 Reports
</li>
          <li
  onClick={() =>
    document
      .getElementById("asset-section")
      .scrollIntoView({ behavior: "smooth" })
  }
  style={{ cursor: "pointer" }}
>
  🛰 Assets
</li>
         
           <li
  onClick={() => {
    if (isAdmin) {
      setShowAdminPanel(true);
    } else {
      alert("Please Login as Admin First");
    }
  }}
  style={{ cursor: "pointer" }}
>
  👤 Admin Panel
</li>
<li
  onClick={() => setShowSettings(true)}
  style={{ cursor: "pointer" }}
>
  ⚙️ Settings
</li>
<li
  onClick={() => setShowHelpDesk(true)}
  style={{ cursor: "pointer" }}
>
  🆘 Help desk
</li>
<div id="report-section">
           <button
  onClick={downloadPDF}
  className="sidebar-download-btn"
>
📄 PDF Report
</button>


 <button
    onClick={downloadExcel}
    className="sidebar-download-btn"
  > 📈 Excel Report
  </button>

</div>

<li
  onClick={() => {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminName("");
      setShowAdminPanel(false);
      alert("Logged Out");
    } else {
      setShowLogin(true);

      setTimeout(() => {
        document
          .getElementById("login-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 100);
    }
  }}
  style={{ cursor: "pointer" }}
>
  {isAdmin ? "🚪 Logout" : "🔐 Login"}
</li>
        </ul>
      </div>

      {/* Main */}
      <div className="main">
        {showLogin && !isAdmin && (
  <div className="login-box"
   id="login-section">
    <h2>Admin Login</h2>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      onClick={() => {
  const admin = admins.find(
    (a) =>
      a.username === username &&
      a.password === password
  );

  if (admin) {
    setIsAdmin(true);
    setAdminName(admin.username);
    setShowLogin(false);
    alert("Login Successful");
  } else {
    alert("Wrong Credentials");
  }
}}
    >
      Login
    </button>

    <button
      onClick={() => setShowLogin(false)}
    >
      Cancel
    </button>
  </div>
)}
{showAdminPanel && isAdmin && (
  <div className="admin-panel">
    <h2>👤 Admin Control Center</h2>

    <div className="admin-card">
      <h3>Admin Information</h3>

      <p>
        Logged In As:
        <strong> {adminName}</strong>
      </p>

      <p>
        Role:
        <strong> Telecom Administrator</strong>
      </p>
<hr />

<h3>➕ Add New Admin</h3>

<input
  type="text"
  placeholder="New Admin Username"
  value={newAdminUser}
  onChange={(e) => setNewAdminUser(e.target.value)}
/>

<input
  type="password"
  placeholder="New Admin Password"
  value={newAdminPass}
  onChange={(e) => setNewAdminPass(e.target.value)}
/>

<button onClick={addAdmin}>
  Add Admin
</button>
<hr />

<h3>👥 Manage Admins</h3>

{admins.map((admin, index) => (
<div
  key={admin._id}
  className="admin-item"
>
    <span className="admin-name">
  👤 {admin.username}
</span>

<button
  className="delete-admin-btn"
  onClick={() => {
    console.log("Admin Object:", admin);
    console.log("Admin ID:", admin._id);

    deleteAdmin(admin._id);
  }}
  style={{
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  Delete
</button>
  </div>
))}
      <button
        onClick={() => {
          setIsAdmin(false);
          setAdminName("");
          setShowAdminPanel(false);
          alert("Logged Out");
        }}
      >

        🚪 Logout
      </button>
    </div>
  </div>
)}

        {/* Navbar */}
   <div className="navbar">

  <div className="search-container">


    <div className="search-wrapper">
      <span className="search-icon">🔍</span>

     <input
  type="text"
  className="search-bar"
placeholder="Search by asset, station, gear or status..."
  value={searchTerm}
onChange={(e) => {
  const value = e.target.value;

  setSearchTerm(value);

  if (value.trim() === "") {
    setSearchSuggestions([]);
    return;
  }

  const matches = failures.filter((failure) =>
    (
      failure.title +
" " +
failure.location +
" " +
failure.section +
" " +
failure.status
    )
      .toLowerCase()
      .includes(value.toLowerCase())
  );

  setSearchSuggestions(matches.slice(0, 5));
}}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      document
        .getElementById("failure-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  }}
/>
{searchSuggestions.length > 0 && searchTerm !== "" && (
  <div className="search-suggestions-box">
    {searchSuggestions.map((item, index) => (
      <div
        key={index}
        className="search-suggestion-item"
        onClick={() => {
          setSearchTerm(item.title);
          setSearchSuggestions([]);
        }}
      >
        🔍 {item.title} • {item.location}
      </div>
    ))}
  </div>
)}
    </div>
    
    <p className="result-count">
      {filteredFailures.length} result(s) found
    </p>
   

  </div>
   <div
  className="admin"
  style={{ cursor: "pointer" }}
  onClick={() => {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminName("");
      alert("Logged Out");
    }
  }}
>
  🔔 {isAdmin ? `Admin - ${adminName}` : "Guest"}
</div>

</div>


        

        {/* Header */}
      <div id="dashboard-section">
  <div className="header">
       
  <h1 className="hero-title">
    Railway Telecom Failure Dashboard
  </h1>

  <div className="glow-line"></div>

  <p>
    Real-time Monitoring & Analytics
  </p>
</div>
</div>

        {/* Cards */}
        <div className="cards">
          <div className="card total">
            <h3>Total Failures</h3>
          <p>{totalFailures}</p>
          </div>

          <div className="card critical">
  <h3>SCADA Failures</h3>
  <p>{scadaCount}</p>
</div>

<div className="card resolved">
  <h3>Control Failures</h3>
  <p>{controlCount}</p>
</div>

<div className="card open">
  <h3>FOIS Failures</h3>
  <p>{foisCount}</p>
</div>
        </div>
{/* Charts */}
<div className="charts">

  {/* Pie Chart */}
  <div className="chart-card">
   <h2>Gear Distribution</h2>

    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={100}
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Bar Chart */}
  <div
    id="asset-section"
    className="chart-card"
  >
    <h2>Asset Failures</h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
      <XAxis
  dataKey="asset"
  angle={-35}
  textAnchor="end"
  interval={0}
  height={50}
/>
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="failures"
          fill="#38bdf8"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Top Locations */}
  <div className="chart-card top-location-card">
    <h2>Top Failure Locations</h2>

    {topLocations.length === 0 ? (
      <p>No data available</p>
    ) : (
      topLocations.map(([location, count], index) => (
        <div
  key={location}
  className="location-progress"
>
  <div className="location-header">
    <span>{location}</span>
    <strong>{count}</strong>
  </div>

  <div className="progress-track">
    <div
      className="progress-fill"
      style={{
        width: `${(count / topLocations[0][1]) * 100}%`,
      }}
    ></div>
  </div>
</div>
      ))
    )}
    
  </div>
<div className="chart-card recent-failures-card">
  <h2>Recent Activity</h2>

  {recentFailures.length === 0 ? (
    <p>No recent failures</p>
  ) : (
    recentFailures.map((failure) => (
      <div
        key={failure._id}
        className="activity-row"
      >
        <div>
          <strong>
            🚨 {failure.title}
          </strong>

          <p>
            📍 {failure.location}
          </p>
        </div>

     <span
  className={`section-badge ${failure.gear}`}
>
  {failure.gear}
</span>
      </div>
    ))
  )}
</div>
</div>
        
        {/* Table */}

      <div style={{ marginBottom: "20px" }}>
       
</div>
{isAdmin && (

<div className="form-section">
  <h2>Add New Failure</h2>
  <div className="form-grid">

   <div className="asset-wrapper">
<input
  type="text"
  placeholder="Main Cause"
  value={asset}
  onChange={(e) => {
   const value = e.target.value;

setAsset(value);

if (value.trim() === "") {
  setAssetSuggestions([]);
  return;
}

const matches = telecomAssets.filter((item) =>
  item.toLowerCase().includes(value.toLowerCase())
);

setAssetSuggestions(matches);


setAssetSuggestions(matches);
  }}
/>
{assetSuggestions.length > 0 && asset !== "" && (
  <div className="suggestions-box">
    {assetSuggestions.map((item, index) => (
      <div
        key={index}
        className="suggestion-item"
        onClick={() => {
          setAsset(item);
          setAssetSuggestions([]);
        }}
      >
        {item}
      </div>
    ))}
  </div>
)}
</div>
<div className="location-wrapper">
  <input
    type="text"
    placeholder="Station"
    value={location}
    onChange={(e) => {
      const value = e.target.value;

      setLocation(value);

      if (value.trim() === "") {
        setLocationSuggestions([]);
        return;
      }

      const locationMatches = telecomLocations.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );

      setLocationSuggestions(locationMatches);
    }}
  />

  {locationSuggestions.length > 0 && location !== "" && (
    <div className="suggestions-box">
      {locationSuggestions.map((item, index) => (
        <div
          key={index}
          className="suggestion-item"
          onClick={() => {
            setLocation(item);
            setLocationSuggestions([]);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>
<div className="section-wrapper">
  <input
    type="text"
    placeholder="Section"
    value={section}
    onChange={(e) => {
      const value = e.target.value;

      setSection(value);

      if (value.trim() === "") {
        setSectionSuggestions([]);
        return;
      }

      const matches = sectionList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );

      setSectionSuggestions(matches);
    }}
  />

  {sectionSuggestions.length > 0 && section !== "" && (
    <div className="suggestions-box">
      {sectionSuggestions.map((item, index) => (
        <div
          key={index}
          className="suggestion-item"
          onClick={() => {
            setSection(item);
            setSectionSuggestions([]);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>
<select
  value={gear}
 onChange={(e) => setGear(e.target.value)}
>
  <option value="">Select Gear</option>
  <option value="SCADA">SCADA</option>
  <option value="Control">Control</option>
  <option value="FOIS">FOIS</option>
</select>


<button onClick={addFailure}>
  ➕ Save Failure
</button>

<input
  type="file"
  accept=".xlsx,.xls"
  onChange={(e) => setExcelFile(e.target.files[0])}
/>

<button onClick={uploadExcel}>
  📤 Upload Excel
</button>
  </div>
</div>
)}
{loading && <h3>Loading Failures...</h3>}
<div
  id="failure-section"
className="table-section">
  <h2>Telecom Failures</h2>

       
          <table>
            <thead>
            <tr>
             <th>SN</th>
<th>Station</th>
<th>Section</th>
<th className="date-header">Date</th>
<th>Closing Date</th>
<th className="maincause-header">
  Main Cause
</th>
<th>Gear</th>
<th className="status-header">
  Status
</th>
<th>Actions</th>
</tr>
            </thead>

            <tbody>
  {filteredFailures.length === 0 ? (
    <tr>
      <td
        colSpan="7"
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#94a3b8",
        }}
      >
        🔍 No matching failures found
      </td>
    </tr>
  ) : (
   filteredFailures.map((failure, index) => (
      <tr key={failure._id}>
      <td>{index + 1}</td>

<td>{failure.location || "-"}</td>

<td>{failure.section || "-"}</td>

<td style={{ whiteSpace: "nowrap" }}>
  {new Date(failure.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )}
</td>

<td>
  {failure.closingDate
    ? new Date(failure.closingDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "-"}
</td>

<td>{failure.title || "-"}</td>
<td>{failure.gear || "-"}</td>

<td>
  <span
    className={`status-badge ${failure.status.replace(
      " ",
      "-"
    )}`}
  >
    {failure.status}
  </span>
</td>

      <td>
  {isAdmin && (
    <>
      <button
        onClick={() => updateStatus(failure._id)}
        style={{
          padding: "5px 10px",
          marginRight: "8px",
          background: "#22c55e",
          border: "none",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Update
      </button>
<button
  className="view-btn"
  onClick={() => setSelectedFailure(failure)}
>
  👁 View
</button>

      <button
        onClick={() => {
  if (window.confirm("Delete this failure?")) {
    deleteFailure(failure._id);
  }
}}
        style={{
          padding: "5px 10px",
          background: "#ef4444",
          border: "none",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </>
  )}
</td>
    </tr>
     ))
  )}
</tbody>
          </table>
        </div>
        {selectedFailure && (
  <div className="modal-overlay">
    <div className="modal">

    <h2>Failure Details</h2>
<hr />

<p className="ticket-id">
  Ticket ID:{" "}
  {selectedFailure._id.slice(-6).toUpperCase()}
</p>

<p>
  <strong>Main Cause:</strong>{" "}
  {selectedFailure.title}
</p>
      <p><strong>Station:</strong> {selectedFailure.location}</p>
      <p><strong>Section:</strong> {selectedFailure.section}</p>
    <p><strong>Gear:</strong> {selectedFailure.gear}</p>
    <p>
  <strong>Expected Closing:</strong>{" "}
  {selectedFailure.closingDate
    ? new Date(
        selectedFailure.closingDate
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}
</p>
      <p>
  <strong>Status:</strong>{" "}
  <span
    className={`status-badge ${selectedFailure.status.replace(
      " ",
      "-"
    )}`}
  >
    {selectedFailure.status}
  </span>
</p>
<p>
  <strong>Reported Date:</strong>{" "}
  {new Date(
    selectedFailure.createdAt
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</p>
<div className="failure-summary">
  <h4>📋 Summary</h4>

  <p>
    Failure reported at{" "}
    <strong>{selectedFailure.location}</strong>
    under{" "}
    <strong>{selectedFailure.section}</strong>
    section for{" "}
    <strong>{selectedFailure.gear}</strong>
    gear.

    Current status is{" "}
    <strong>{selectedFailure.status}</strong>.
  </p>
</div>

      <button
        onClick={() => setSelectedFailure(null)}
      >
        Close
      </button>

    </div>
  </div>
)}
      </div>
      {showHelpDesk && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>🆘 Railway Help Desk</h2>

      <p>
        <strong>Toll Free:</strong>
        139
      </p>

      <p>
        <strong>RailMadad:</strong>
        1800-111-321
      </p>

      <p>
        <strong>Email:</strong>
        railmadad@rb.railnet.gov.in
      </p>

      <p>
        <strong>Emergency:</strong>
        182
      </p>

      <button
        onClick={() =>
          setShowHelpDesk(false)
        }
      >
        Close
      </button>
    </div>
  </div>
)}
{showSettings && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>⚙️ Settings</h2>

      <div className="setting-option">
        <span>🌙 Dark Mode</span>

        <button
          onClick={() => {
            setDarkMode(true);
            setShowSettings(false);
          }}
        >
          Select
        </button>
      </div>

      <div className="setting-option">
        <span>☀️ Light Mode</span>

        <button
          onClick={() => {
            setDarkMode(false);
            setShowSettings(false);
          }}
        >
          Select
        </button>
      </div>

      <button
        onClick={() =>
          setShowSettings(false)
        }
      >
        Close
      </button>

    </div>
  </div>
)}
    </div>
  );
}
export default App;