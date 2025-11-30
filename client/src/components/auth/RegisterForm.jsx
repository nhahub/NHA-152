import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
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
      dispatch(registerUser({ userName: values.userName, email: values.email, password: values.password })).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message || "Registration successful!",
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data?.payload?.message || "Registration failed",
            variant: "destructive",
          });
        }
      });
    },
  });

  // Reset form on component mount
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
        name="userName"
        placeholder="Write a username"
        autoComplete="off"
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors text-gray-900"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.userName}
      />
      {formik.touched.userName && formik.errors.userName && (
        <p className="text-red-500 text-sm">{formik.errors.userName}</p>
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
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors text-gray-900"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
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
        className="w-full p-3.5 border border-gray-300 rounded-md focus:border-[#3785D8] outline-none transition-colors text-gray-900"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password && (
        <p className="text-red-500 text-sm">{formik.errors.password}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-6 p-3.5 rounded-md text-white text-base font-semibold bg-gradient-to-br from-[#8F8CE1] to-[#3785D8]
          transition-opacity ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
      >
        {isLoading ? (
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

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link 
          to="/auth/login" 
          className="text-[#3785D8] font-semibold hover:underline"
        >
          Login here
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;

