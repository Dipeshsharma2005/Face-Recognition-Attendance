import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import Webcam from 'react-webcam';
import { Camera, CheckCircle2, UploadCloud, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';


const RegisterUser = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setMessage("");
  };

    useEffect(() => {
      if (message) {
        const timer = setTimeout(() => setMessage(""), 4000);
        return () => clearTimeout(timer);
      }
    }, [message]);

  const handleRegister = async () => {
    if (!capturedImage || !name || !email) {
      return setMessage("⚠️ Please enter all details and capture an image.");
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const blob = await fetch(capturedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("image", blob, "face.jpg");

      const res = await axios.post(
        "http://localhost:8080/api/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message || "✅ User registered successfully!");
      setSuccess(true);
      toast.success(res.data.message || "User registered successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Error registering user");
      toast.error(err.response?.data?.error || "Registration failed!");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex pt-20 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-700 to-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
        <motion.div
            className="bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <h2 className="text-3xl font-bold text-center mb-6">
            🧑‍💻 Register User
            </h2>

            <div className="rounded-xl overflow-hidden border border-slate-700 mb-4">
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "user" }}
                className="rounded-xl"
            />
            </div>

            <div className="flex justify-center mb-4">
            <button
                onClick={captureImage}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold shadow-lg transition"
            >
                <Camera size={18} /> Capture
            </button>
            </div>

            {capturedImage && (
            <motion.div
                className="mb-5 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <img
                src={capturedImage}
                alt="Captured"
                className="rounded-lg mx-auto shadow-md border border-slate-700"
                width="260"
                />
                <p className="text-sm text-gray-400 mt-2">
                Preview of your captured face
                </p>
            </motion.div>
            )}
            <div className="flex flex-col gap-3 mb-4">
            <input
                type="text"
                placeholder="Full Name"
                className="p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email Address"
                className="p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${
                    loading
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
                {loading?(
                    <>
                        <UploadCloud className='animate-bounce' size={18}/> Uploading...
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={18} /> Register
                    </>
                )}
            </button>

            {message && (
                <motion.div
                    className={`mt-5 text-center font-medium flex items-center justify-center gap-2 ${
                        success ? "text-green-400" : "text-red-400"
                    }`}
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                >
                    {success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {message}
                </motion.div>
            )}
        </motion.div>
    </motion.div>
  )
}

export default RegisterUser