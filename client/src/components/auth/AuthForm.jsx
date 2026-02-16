import { useState } from "react";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { validateFiled } from "./validateFiled";
import facebook from "../../assets/social/facebook.svg";
import google from "../../assets/social/google.png";
import { NavLink } from "react-router-dom";

const AuthForm = ({ type, form, onChange, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const isLogin = type === "login";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    onChange(e);
    const { name, value } = e.target;
    const error = validateFiled(name, value, "change", type);
    setErrors((prev) => ({ ...prev, ...error }));
  };

  const handleErrors = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const error = validateFiled(name, value);
    setErrors((prev) => ({ ...prev, ...error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullNameError = validateFiled("fullName", form.fullName);
    const emailError = validateFiled("email", form.email);
    const passwordError = validateFiled("password", form.password);
    setErrors((prev) => ({
      ...prev,
      ...fullNameError,
      ...emailError,
      ...passwordError,
    }));

    if (isLogin) {
      if (!emailError.email && !passwordError.password) {
        onSubmit(e);
      }
    } else {
      if (
        !fullNameError.fullName &&
        !emailError.email &&
        !passwordError.password
      ) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className="w-md bg-white p-2 rounded-xl">
      <div className="w-full rounded-lg bg-linear-to-b from-emerald-100 via-white via-20% to-white">
        <div className="w-full py-9 px-6 flex flex-col items-center gap-10">
          {/* Icon */}
          <div className="p-2 bg-linear-to-b from-emerald-100 to-emerald-200 rounded-full">
            <div className="p-4 bg-linear-to-b from-emerald-300 to-emerald-500 rounded-full text-neutral-200">
              <Mail size={22} />
            </div>
          </div>

          <div className="w-full">
            {/* Content */}
            <div className="text-center">
              <h1 className="mb-1 text-2xl font-bold text-gray-700">
                {isLogin
                  ? "Welcome Back Trackora"
                  : "Create your Trackora account"}
              </h1>
              <p className="text-base text-zinc-500">
                {isLogin
                  ? "Please sign in to your account"
                  : "Please enter your details to register"}
              </p>
            </div>

            {/* Form */}
            <form
              className="w-full mt-6 flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {/* Input fields container */}
              <div className="w-full flex flex-col gap-4">
                {/* Full Name */}
                {!isLogin && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-neutral-950"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center bg-neutral-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500">
                      <UserRound size={20} className="ml-3 text-neutral-600" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        className="w-full p-2 focus:outline-none"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={handleErrors}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-neutral-950"
                  >
                    Email
                  </label>
                  <div className="flex items-center bg-neutral-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500">
                    <Mail size={20} className="ml-3 text-neutral-600" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full p-2 focus:outline-none"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleErrors}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-950"
                  >
                    Password
                  </label>
                  <div className="flex items-center bg-neutral-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500">
                    <LockKeyhole size={20} className="ml-3 text-neutral-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      className="w-full p-2 focus:outline-none"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleErrors}
                    />
                    {/* Password visibilty eye button */}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="mr-3 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye size={20} className="text-neutral-600" />
                      ) : (
                        <EyeOff size={20} className="text-neutral-600" />
                      )}
                    </button>
                  </div>
                  {!errors.password &&
                    !isLogin &&
                    form.password.trim().length === 0 && (
                      <p className="text-gray-400 text-xs">
                        Password must be at least 8 characters, with uppercase,
                        number, and symbol.
                      </p>
                    )}
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                  <p
                    className="text-black text-right text-sm hover:text-neutral-600 underline cursor-pointer"
                    style={isLogin ? { display: "block" } : { display: "none" }}
                  >
                    Forgot Password
                  </p>
                </div>
              </div>

              {/* button */}
              <button
                type="submit"
                className="w-full p-3 text-sm leading-none bg-linear-to-b from-emerald-500 hover:from-emerald-400 to-emerald-700 hover:to-emerald-600 text-white rounded-lg hover:bg-emerald-600 cursor-pointer transition duration-200"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>

              {/* Or */}
              <div className="flex items-center gap-1">
                <hr className="flex-1 border border-gray-300" />
                <span className="text-xs text-zinc-500">Or Continue with</span>
                <hr className="flex-1 border border-gray-300" />
              </div>

              {/* Social */}
              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  className="min-w-30 flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200"
                >
                  <img src={google} alt="google" className="w-5 h-5" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="min-w-30 flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200"
                >
                  <img src={facebook} alt="facebook" className="w-5 h-5" />
                  <span>Facebook</span>
                </button>
              </div>
              <p className="text-base text-center text-zinc-500">
                {`${isLogin ? "Don't" : "Already"} have an account? `}
                <NavLink
                  to={isLogin ? "/register" : "/login"}
                  className="text-emerald-600 hover:text-emerald-500"
                >
                  {isLogin ? "Register" : "Login"}
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
