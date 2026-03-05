import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const RecognizeUser = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const captureAndRecognize = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return setMessage("⚠️ Unable to capture image.");

    setCapturedImage(imageSrc);
    setLoading(true);
    setMessage("");
    setSuccess(null);

    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      // ⚙️ change backend URL here easily
    //   const API_URL = "http://localhost:5001/recognize"; // Flask
      const API_URL = "http://localhost:8080/api/face/recognize"; // Spring Boot

      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "✅ Face recognized successfully!");
      setSuccess(true);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Face not recognized!");
      setSuccess(false);
      toast.error("Recognition failed!");

    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex pt-20 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gray-800/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg border border-gray-700"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          👁️ Recognize User
        </h2>

        <div className="rounded-xl overflow-hidden border border-gray-700 mb-5 shadow-inner">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
            className="rounded-xl"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={captureAndRecognize}
            disabled={loading}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Recognizing...
              </>
            ) : (
              <>
                <Camera size={18} /> Capture & Recognize
              </>
            )}
          </button>
        </div>

        {capturedImage && (
          <motion.div
            className="mt-5 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-lg mx-auto shadow-md border border-gray-700"
              width="260"
            />
            <p className="text-sm text-gray-400 mt-2">
              Preview of captured frame
            </p>
          </motion.div>
        )}

        {message && (
          <motion.div
            className={`mt-6 text-center font-medium flex items-center justify-center gap-2 ${
              success ? "text-green-400" : "text-red-400"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {message}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecognizeUser;
