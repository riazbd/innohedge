import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import io from "socket.io-client";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaBell,
  FaHistory,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaTasks,
} from "react-icons/fa";

import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Cell,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";

// WebSocket connection
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({
    signups: 0,
    submissions: 0,
    traffic: 0,
  });
  const [trafficData, setTrafficData] = useState({
    rawTraffic: [],
    dailyStats: [],
  });
  const [settings, setSettings] = useState({
    siteTitle: "InnoHedge",
    supportEmail: "support@innohedge.com"
  });
  const [activityLog, setActivityLog] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // For modal details
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // Fetch initial data and setup WebSocket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [
          usersRes,
          formsRes,
          analyticsRes,
          settingsRes,
          logRes,
          trafficRes,
        ] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/forms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/traffic`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setFormSubmissions(formsRes.data);
        setAnalytics(analyticsRes.data);
        setSettings(settingsRes.data);
        setActivityLog(logRes.data);
        setTrafficData(trafficRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on("newTraffic", (traffic) =>
      setTrafficData((prev) => ({
        ...prev,
        rawTraffic: [
          { endpoint: traffic.endpoint, timestamp: traffic.timestamp },
          ...prev.rawTraffic.slice(0, 99),
        ],
      }))
    );

    return () => socket.off();
  }, [router]);

  // Filter data based on search query
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );
  const filteredForms = useMemo(
    () =>
      formSubmissions.filter((f) =>
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [formSubmissions, searchQuery]
  );

  // CRUD Operations
  const handleUserUpdate = async (userId, role) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(users.map((u) => (u._id === userId ? { ...u, role } : u)));
      setActivityLog([
        ...activityLog,
        { action: `Updated user role to ${role}`, timestamp: new Date() },
      ]);
      toast.success('User Updated');
    } catch (err) {
      console.error(err);
      toast.error('You can\'t edit user');
    }
  };

  const handleUserDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
  
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          setActivityLog((prev) => [
            ...prev,
            { action: `Deleted user ${userId}`, timestamp: new Date() },
          ]);
  
          toast.success("User removed");
        } catch (err) {
          console.error("Error deleting user:", err);
          toast.error("You can't delete this user");
        }
      }
    });
  };

  const handleFormDelete = async (formId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/forms/${formId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
  
          setFormSubmissions((prev) => prev.filter((f) => f._id !== formId));
          setActivityLog((prev) => [
            ...prev,
            { action: `Deleted form submission ${formId}`, timestamp: new Date() },
          ]);
  
          toast.success("Form submission deleted");
        } catch (err) {
          console.error("Error deleting form:", err);
          toast.error("Failed to delete form submission");
        }
      }
    });
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setActivityLog([
        ...activityLog,
        { action: "Updated site settings", timestamp: new Date() },
      ]);
      toast.success("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white text-2xl font-orbitron">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Head>
        <title>{settings.siteTitle} Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-64 bg-gray-900 p-6 fixed h-full z-20 border-r border-gray-800"
      >
        <h2 className="text-2xl font-orbitron text-yellow-400 mb-8 uppercase">
          {settings.siteTitle}
        </h2>
        <nav className="space-y-4">
          {[
            { id: "analytics", label: "Dashbaord", icon: <FaChartBar /> },
            { id: "users", label: "Users", icon: <FaUsers /> },
            { id: "forms", label: "Forms", icon: <FaFileAlt /> },
            { id: "settings", label: "Settings", icon: <FaCog /> },
            { id: "traffic", label: "Traffic", icon: <FaTasks /> },
            { id: "activity", label: "Activity", icon: <FaHistory /> },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{
                scale: 1.05,
                backgroundColor:
                  activeTab === tab.id
                    ? "rgb(234, 179, 8)"
                    : "rgba(255, 215, 0, 0.1)", // Set explicitly
              }}
              whileTap={{
                scale: 0.95,
                backgroundColor:
                  activeTab === tab.id
                    ? "rgb(234, 179, 8)"
                    : "rgba(255, 215, 0, 0.1)",
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-orbitron ${
                activeTab === tab.id
                  ? "bg-yellow-500 text-black"
                  : "text-yellow-400 hover:text-yellow-300"
              }`}
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "rgb(234, 179, 8)"
                    : "rgba(0, 0, 0, 0)",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 p-3 rounded-lg font-orbitron text-red-400 hover:text-red-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
        </nav>
      </motion.aside>

      {/* Persistent Sidebar Toggle Button - Always visible */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className={`fixed top-4 z-30 transition-all duration-300 p-1 bg-gray-800 text-yellow-400 rounded-r-lg border-y border-r border-yellow-500/30 ${
          isSidebarOpen ? "left-64" : "left-0"
        }`}
      >
        <FaBars />
      </motion.button>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >

        {/* Search Bar */}
        {activeTab === "users" && (
          <div className="mb-6 flex items-center gap-4 mt-8">
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        )}

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-2xl p-8 border border-yellow-500/30 shadow-2xl"
        >
          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">
                User Management
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-poppins">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-700 hover:bg-gray-700"
                      >
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUserUpdate(user._id, e.target.value)
                            }
                            className="bg-gray-700 border border-gray-600 rounded p-1 text-white"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </td>
                        <td className="py-2 flex gap-2">
                          <button
                            onClick={() => setSelectedItem(user)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUserDelete(user._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "forms" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">
                Form Submissions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-poppins">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Message</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredForms.map((form) => (
                      <tr
                        key={form._id}
                        className="border-b border-gray-700 hover:bg-gray-700"
                      >
                        <td className="py-2">{form.name}</td>
                        <td className="py-2">{form.email}</td>
                        <td className="py-2">{form.message.slice(0, 50)}...</td>
                        <td className="py-2">
                          {new Date(form.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 flex gap-2">
                          <button
                            onClick={() => setSelectedItem(form)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleFormDelete(form._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* {activeTab === "analytics" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["signups", "submissions", "traffic"].map((metric) => (
                  <motion.div
                    key={metric}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-gray-700 rounded-lg border border-yellow-500/20"
                  >
                    <h3 className="text-lg font-orbitron">{metric.charAt(0).toUpperCase() + metric.slice(1)}</h3>
                    <p className="text-3xl font-bold text-yellow-400">{analytics[metric]}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )} */}

          {activeTab === "analytics" && (
            <div>
              {/* <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">
                Dashboard
              </h2> */}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {["signups", "submissions", "traffic"].map((metric) => (
                  <motion.div
                    key={metric}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-gray-700 rounded-lg border border-yellow-500/20"
                  >
                    <h3 className="text-lg font-orbitron">
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </h3>
                    <p className="text-3xl font-bold text-yellow-400">
                      {analytics[metric]}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Roles Distribution Chart */}
                <div className="bg-gray-700 p-6 rounded-lg border border-yellow-500/20">
                  <h3 className="text-lg font-orbitron mb-4">
                    User Roles Distribution
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Admin",
                              value: users.filter(
                                (user) => user.role === "Admin"
                              ).length,
                            },
                            {
                              name: "Editor",
                              value: users.filter(
                                (user) => user.role === "Editor"
                              ).length,
                            },
                            {
                              name: "Viewer",
                              value: users.filter(
                                (user) => user.role === "Viewer"
                              ).length,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {[
                            { color: "#eab308" }, // Admin - Yellow
                            { color: "#ec4899" }, // Editor - Pink
                            { color: "#3b82f6" }, // Viewer - Blue
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#eab308",
                            color: "white",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Form Submissions Timeline */}
                <div className="bg-gray-700 p-6 rounded-lg border border-yellow-500/20">
                  <h3 className="text-lg font-orbitron mb-4">
                    Form Submissions Timeline
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={generateSubmissionTimelineData(formSubmissions)}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey="date" stroke="#d1d5db" />
                        <YAxis stroke="#d1d5db" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#ec4899",
                            color: "white",
                          }}
                        />
                        <CartesianGrid stroke="#4b5563" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#ec4899"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* User Registration Timeline */}
                <div className="bg-gray-700 p-6 rounded-lg border border-yellow-500/20">
                  <h3 className="text-lg font-orbitron mb-4">
                    User Registration Timeline
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={generateUserRegistrationData(users)}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUsers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#d1d5db" />
                        <YAxis stroke="#d1d5db" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#3b82f6",
                            color: "white",
                          }}
                        />
                        <CartesianGrid stroke="#4b5563" strokeDasharray="3 3" />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity Distribution */}
                <div className="bg-gray-700 p-6 rounded-lg border border-yellow-500/20">
                  <h3 className="text-lg font-orbitron mb-4">
                    Recent Activity Distribution
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateActivityData(activityLog)}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey="type" stroke="#d1d5db" />
                        <YAxis stroke="#d1d5db" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#10b981",
                            color: "white",
                          }}
                        />
                        <CartesianGrid stroke="#4b5563" strokeDasharray="3 3" />
                        <Bar
                          dataKey="count"
                          fill="#10b981"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

{activeTab === "traffic" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">Traffic Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-orbitron mb-2">Recent Visits (Last 100)</h3>
                  <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left font-poppins">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2">Endpoint</th>
                          <th className="py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trafficData.rawTraffic.map((visit, index) => (
                          <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-2">{visit.endpoint}</td>
                            <td className="py-2">{new Date(visit.timestamp).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-orbitron mb-2">Daily Stats (Last 30 Days)</h3>
                  <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left font-poppins">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2">Date</th>
                          <th className="py-2">Visits</th>
                          <th className="py-2">Unique Visitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trafficData.dailyStats.map((stat) => (
                          <tr key={stat._id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-2">{new Date(stat.date).toLocaleDateString()}</td>
                            <td className="py-2">{stat.visits}</td>
                            <td className="py-2">{stat.uniqueVisitors}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">
                Settings
              </h2>
              <form
                onSubmit={handleSettingsUpdate}
                className="space-y-6 font-poppins"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) =>
                      setSettings({ ...settings, siteTitle: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-orbitron rounded-lg"
                >
                  Save Settings
                </motion.button>
              </form>
            </div>
          )}

          

          {activeTab === "activity" && (
            <div>
              <h2 className="text-2xl font-orbitron text-yellow-400 mb-4">
                Activity Log
              </h2>
              <ul className="space-y-2 font-poppins">
                {activityLog.map((log, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-700 rounded-lg border border-yellow-500/20"
                  >
                    {log.action} - {new Date(log.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal for Detailed View */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 p-6 rounded-lg max-w-lg w-full border border-yellow-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-orbitron text-yellow-400 mb-4">
                {activeTab === "users"
                  ? "User Details"
                  : "Form Submission Details"}
              </h3>
              {activeTab === "users" ? (
                <>
                  <p>
                    <strong>Email:</strong> {selectedItem.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedItem.role}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedItem._id}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Name:</strong> {selectedItem.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedItem.email}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedItem.message}
                  </p>
                  <p>
                    <strong>Submitted At:</strong>{" "}
                    {new Date(selectedItem.submittedAt).toLocaleString()}
                  </p>
                </>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full py-2 bg-gray-700 text-yellow-400 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

{
  /* Helper functions to process real data for charts */
}
const generateSubmissionTimelineData = (submissions) => {
  // Get submissions from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Create a map for each day
  const dateMap = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dateMap[dateStr] = 0;
  }

  // Count submissions by day
  submissions.forEach((submission) => {
    const submissionDate = new Date(submission.submittedAt);
    if (submissionDate >= oneWeekAgo) {
      const dateStr = submissionDate.toISOString().split("T")[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += 1;
      }
    }
  });

  // Convert to array for chart
  return Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const generateUserRegistrationData = (users) => {
  // Get registrations by month for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Create a map for each month
  const monthMap = {};
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().substring(0, 7); // YYYY-MM format
    monthMap[monthStr] = 0;
  }

  // Count registrations by month
  users.forEach((user) => {
    // Assuming createdAt is available from timestamps: true in schema
    if (user.createdAt) {
      const regDate = new Date(user.createdAt);
      if (regDate >= sixMonthsAgo) {
        const monthStr = regDate.toISOString().substring(0, 7);
        if (monthMap[monthStr] !== undefined) {
          monthMap[monthStr] += 1;
        }
      }
    }
  });

  // Convert to array for chart
  return Object.entries(monthMap)
    .map(([date, count]) => ({
      date: new Date(date + "-01").toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      }),
      count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const generateActivityData = (activities) => {
  // Get activity distribution by type
  const actionTypes = {};

  activities.forEach((activity) => {
    const action = activity.action || "";

    // Extract action type (first word or category)
    let actionType = "Other";

    if (action.includes("Updated")) actionType = "Updated";
    else if (action.includes("Deleted")) actionType = "Deleted";
    else if (action.includes("Created")) actionType = "Created";
    else if (action.includes("settings")) actionType = "Settings";

    actionTypes[actionType] = (actionTypes[actionType] || 0) + 1;
  });

  // Convert to array for chart
  return Object.entries(actionTypes)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
};
