import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        identifier,
        password,
      });

      const { username, token } = response.data;

      // حفظ بس username و token، بدون باسورد
      const userData = { username, token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
  setLoading(true);
  setError(null);

  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email,
      password,
    });

    // بعد الريجستر، نعمل login تلقائي
    await login(username, password);

    setLoading(false);
    return true;
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Registration failed");
    setLoading(false);
    return false;
  }
};
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // حذف كل حاجة
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
