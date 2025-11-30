import React from "react";
import { useAuth } from "../context/AuthContext";



const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#C8D8E8] text-[#1E0F75]">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username} 🎉</h1>
      <p className="text-lg mb-6">You are logged in successfully!</p>

      <button
        onClick={logout}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
