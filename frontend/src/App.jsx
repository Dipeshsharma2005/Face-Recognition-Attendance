import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import RegisterUser from "./components/RegisterUser";
import RecognizeUser from "./components/RecognizeUser";
import AttendanceDashboard from "./components/AttendanceDashboard";
import { Toaster } from "react-hot-toast";
import Users from "./components/Users";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterUser /></PageTransition>} />
        <Route path="/recognize" element={<PageTransition><RecognizeUser /></PageTransition>} />
        <Route path="/attendance" element={<PageTransition><AttendanceDashboard /></PageTransition>} />
        <Route path="/users" element={<PageTransition><Users /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
