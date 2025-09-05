import React, { useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", phone: "", address: "" });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://valo-deal-backend.vercel.app/api/v1/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://valo-deal-backend.vercel.app/api/v1/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      phone: user.phone || "",
      address: user.address || "",
    });
  };

  // Save updated user
  const handleSave = async (id) => {
    try {
      const res = await axios.put(
        `https://valo-deal-backend.vercel.app/api/v1/users/${id}`,
        formData,
        { withCredentials: true }
      );

      setUsers(
        users.map((user) => (user._id === id ? { ...user, ...res.data } : user))
      );

      setEditingUser(null);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>👤 User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <tr>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Role</th>
              <th style={{ padding: "12px" }}>Phone</th>
              <th style={{ padding: "12px" }}>Address</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                style={{
                  backgroundColor:
                    editingUser === user._id
                      ? "#ccffcc" // ✅ Light green highlight
                      : index % 2 === 0
                        ? "#f9f9f9"
                        : "white",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Name */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name || "No Name"
                  )}
                </td>

                {/* Email */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>

                {/* Role */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role || "user"
                  )}
                </td>

                {/* Phone */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    user.phone || "N/A"
                  )}
                </td>

                {/* Address */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  ) : (
                    user.address || "N/A"
                  )}
                </td>

                {/* Actions */}
                <td style={{ padding: "10px" }}>
                  {editingUser === user._id ? (
                    <>
                      <button
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "6px 12px",
                          marginRight: "5px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSave(user._id)}
                      >
                        Save
                      </button>
                      <button
                        style={{
                          backgroundColor: "gray",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={{
                          backgroundColor: "#2196F3",
                          color: "white",
                          padding: "6px 12px",
                          marginRight: "5px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          backgroundColor: "#f44336",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPage;
