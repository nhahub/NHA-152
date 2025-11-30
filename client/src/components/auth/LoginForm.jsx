import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      dispatch(loginUser({ email: values.email, password: values.password })).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message || "Login successful!",
          });
          // Navigate based on user role
          const user = data?.payload?.user;
          if (user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }
        } else {
          toast({
            title: data?.payload?.message || "Login failed",
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
    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
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

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-6 p-3.5 rounded-md text-white text-base font-semibold bg-gradient-to-br from-[#1E0F75] to-[#3785D8] transition-opacity ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {isLoading ? (
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

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link 
          to="/auth/register" 
          className="text-[#3785D8] font-semibold hover:underline"
        >
          Register here
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;

