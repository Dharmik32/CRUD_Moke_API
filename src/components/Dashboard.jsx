import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const response = await fetch("https://reqres.in/api/users");
    const data = await response.json();
    console.log("fetchusers", data);
    setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }), // Send both name and email
    });
    const newUser = await response.json(); // Get the response
    console.log("New User Added:", newUser); // Log the new user
    fetchUsers(); // Refresh the user list
    setName(""); // Clear the name input
    setEmail(""); // Clear the email input
  };

  const handleEditUser = async (user) => {
    setEditingUser(user);
    setName(user.first_name); // Assuming you want to edit first name
    setEmail(user.email); // Set email for editing
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://reqres.in/api/users/${editingUser.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }), // Update both name and email
      }
    );
    fetchUsers();
    setName("");
    setEmail("");
    setEditingUser(null);

    console.log("response handleUpdateUser", response);
  };

  const handleDeleteUser = async (id) => {
    await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleLogout = () => {
    // Remove token or any user-related data from local storage
    localStorage.removeItem("token"); // Adjust this based on your token storage
    // Redirect to login page using navigate
    console.log("test", navigate);
    window.location.href = "/";
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Logout
      </button>
      <form
        onSubmit={editingUser ? handleUpdateUser : handleAddUser}
        className="mb-4"
      >
        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email" // Email input
          placeholder="User  Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingUser ? "Update User" : "Add User"}
        </button>
      </form>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Avatar</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.id}</td>
              <td className="border border-gray-300 p-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">
                <img
                  src={user.avatar}
                  alt={user.first_name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Dashboard;
