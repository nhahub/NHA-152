import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required("Username or email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const success = await login(values.identifier, values.password);
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
    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
      <label className="mt-3 mb-2 font-semibold text-[#1C1DAB]">
        Username or email address <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="identifier"
        placeholder="Enter your username or email"
        autoComplete="off"
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors"
        onChange={formik.handleChange}
        value={formik.values.identifier}
      />
      {formik.touched.identifier && formik.errors.identifier && (
        <p className="text-red-500 text-sm">{formik.errors.identifier}</p>
      )}

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

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 p-3.5 rounded-md text-white text-base font-semibold bg-gradient-to-br from-[#1E0F75] to-[#3785D8] transition-opacity ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Logging in...
          </div>
        ) : (
          "Log in"
        )}
      </button>

      <div className="flex flex-wrap justify-between items-center mt-3.5 text-sm">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-teal-700" />
          Remember me
        </label>
        <a href="#" className="text-red-500 hover:underline">
          Forgot your password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
