import { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ siteName: 'Innohed' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState(['admin', 'user', 'editor']);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      alert('Access denied');
      return;
    }

    const fetchData = async () => {
      const [subRes, userRes] = await Promise.all([
        axios.get('http://localhost:5000/api/forms/submissions', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/auth/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSubmissions(subRes.data);
      setUsers(userRes.data);
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/auth/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
  };

  const analyticsData = {
    labels: ['Submissions', 'Users'],
    datasets: [{
      label: 'Count',
      data: [submissions.length, users.length],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h2 className="text-4xl font-bold mb-8 text-white">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Form Submissions</h3>
          <ul>
            {submissions.map((sub) => (
              <li key={sub._id} className="mb-2">{sub.name} - {sub.email}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id} className="mb-2 flex justify-between items-center">
                <span>{user.email} - {user.role}</span>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="ml-4 p-2 border rounded"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Analytics</h3>
          <Bar data={analyticsData} />
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <button className="btn btn-primary w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Settings</button>
        </div>
      </div>
    </div>
  );
}