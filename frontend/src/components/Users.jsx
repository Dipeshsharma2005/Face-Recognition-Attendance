import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users"); 
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("⚠️ Unable to connect to backend server")
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen pt-20 text-white flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">All Users</h1>
      <div className="w-full max-w-4xl bg-gray-800/70 p-6 rounded-2xl shadow-lg">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center">No users found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-blue-400">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="border-b border-gray-700 hover:bg-gray-700/30"
                >
                  <td className="py-2">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
