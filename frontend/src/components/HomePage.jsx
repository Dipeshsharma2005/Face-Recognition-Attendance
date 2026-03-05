import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-3 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
         Face Recognition Attendance
      </motion.h1>
      <p className="text-gray-400 mb-10 text-center">
        Smart and secure attendance using face recognition
      </p>

      {/* Main Card */}
      <motion.div
        className="bg-gray-800/60 backdrop-blur-md shadow-2xl rounded-2xl p-10 flex flex-col gap-6 w-[90%] max-w-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Register Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="flex items-center justify-center gap-3 bg-blue-600 cursor-pointer hover:bg-blue-700 text-lg font-semibold py-4 rounded-xl shadow-lg transition-all"
        >
          <UserPlus size={22} /> Register User
        </motion.button>

        {/* Recognize Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/recognize")}
          className="flex items-center justify-center gap-3 bg-green-600 cursor-pointer hover:bg-green-700 text-lg font-semibold py-4 rounded-xl shadow-lg transition-all"
        >
          <Camera size={22} /> Recognize User
        </motion.button>

        {/* View All Registered (Optional Future Feature) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={()=>navigate("/users")}
          className="flex items-center justify-center gap-3 bg-red-600 cursor-pointer text-lg font-semibold py-4 rounded-xl opacity-60"
        >
          <Users size={22} /> View Registered Users
        </motion.button>
      </motion.div>

      <p className="text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} Face Attendance System
      </p>
    </motion.div>
  );
};

export default HomePage;
