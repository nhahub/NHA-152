import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be 6 characters or more")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const success = await register(values.username, values.email, values.password);
      if (success) {
        navigate("/dashboard");
      }
    },
  });

  // تنظيف الفورم عند تحميل الصفحة
  useEffect(() => {
    formik.resetForm();
  }, []);

  return (
    <form className="flex flex-col" onSubmit={formik.handleSubmit} autoComplete="off">
      {/* Username */}
      <label className="mt-3 mb-2 font-semibold text-[#1C1DAB]">
        Username <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="username"
        placeholder="Write a username"
        autoComplete="off"
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      {formik.touched.username && formik.errors.username && (
        <p className="text-red-500 text-sm">{formik.errors.username}</p>
      )}

      {/* Email */}
      <label className="mt-3 mb-2 font-semibold text-[#1C1DAB]">
        Email address <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        autoComplete="off"
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && (
        <p className="text-red-500 text-sm">{formik.errors.email}</p>
      )}

      {/* Password */}
      <label className="mt-3 mb-2 font-semibold text-[#1C1DAB]">
        Password <span className="text-red-500">*</span>
      </label>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        autoComplete="new-password"
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password && (
        <p className="text-red-500 text-sm">{formik.errors.password}</p>
      )}

      {/* Error from backend */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 p-3.5 rounded-md text-white text-base font-semibold bg-gradient-to-br from-[#8F8CE1] to-[#3785D8]
          transition-opacity ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Registering...
          </div>
        ) : (
          "Register"
        )}
      </button>

      {/* Privacy Text */}
      <p className="mt-5 text-[13px] text-gray-600 leading-6">
        Your personal data will be used to process your order, support your experience
        throughout this website, and for other purposes described in our{" "}
        <a href="#" className="text-[#1E0F75] font-semibold hover:underline">
          privacy policy
        </a>.
      </p>
    </form>
  );
};

export default RegisterForm;
