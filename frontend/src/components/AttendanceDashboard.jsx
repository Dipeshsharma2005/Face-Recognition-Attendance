import React, { useEffect, useState } from "react";
import axios from "axios";
import {motion } from 'framer-motion'

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/attendance/today");
        setRecords(res.data);
      }catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("⚠️ Unable to connect to backend server");
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen pt-20 text-white flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">Today's Attendance</h1>
      <div className="w-full max-w-3xl bg-gray-800/70 p-6 rounded-2xl shadow-lg">
        {records.length === 0 ? (
          <p className="text-gray-400 text-center">No records yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-blue-400">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
                {records.map((rec, i) => (
                    <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                    >
                    <td className="py-2">{rec.name}</td>
                    <td>{rec.email}</td>
                    <td>{rec.date}</td>
                    <td>{rec.time}</td>
                    </motion.tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;
