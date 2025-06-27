import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  PiBuildingsBold,
  PiPasswordDuotone,
} from "react-icons/pi";
import {
  TbUser,
  TbMail,
  TbLoader2,
  TbAlertTriangle,
  TbMailFilled,
  TbPhone,
} from "react-icons/tb";
import { LuUserPlus } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { authService } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "tenant", // Default to tenant
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);

      if (result.success) {
        // Navigate based on user role
        if (result.role === "tenant") {
          navigate("/tenant");
        } else if (result.role === "landlord") {
          navigate("/landlord");
        }
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-secondary-plot rounded-sm flex items-center justify-center">
              <PiBuildingsBold size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-medium text-primary-500 tracking-wider">
              DIGIPLOT
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-plot">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Join DigiPlot Property Management
          </p>
        </div>

        {/* Role selector */}
        <div className="border-b border-gray-300/70">
          <div className="flex -mb-px">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "tenant" }))
              }
              className={`py-4 px-8 border-b-2 font-medium text-sm md:text-base transition-colors duration-300 ${
                formData.role === "tenant"
                  ? "border-primary-plot text-primary-plot bg-gradient-to-t from-primary-500/15 via-transparent to-transparent"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Tenant
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "landlord" }))
              }
              className={`py-4 px-8 border-b-2 font-medium text-sm md:text-base transition-colors duration-300 ${
                formData.role === "landlord"
                  ? "border-amber-600 text-amber-600 bg-gradient-to-t from-amber-600/10 via-transparent to-transparent"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Landlord
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-md border-l-4 border-red-500 bg-red-100/80 text-red-800/80 flex items-start">
            <TbAlertTriangle className="h-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
            <p className="text-xs md:text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-secondary-plot mb-1"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-secondary-plot mb-1"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TbUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary-plot mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TbMailFilled className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-secondary-plot mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TbPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-plot mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiPasswordDuotone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-secondary-plot mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiPasswordDuotone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 text-sm font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`group cursor-pointer relative w-full text-sm md:text-base overflow-hidden ${
              formData.role === "tenant"
                ? "bg-gradient-to-r from-secondary-plot to-primary-plot"
                : "bg-gradient-to-r from-secondary-plot/80 to-amber-700"
            } text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
            <span className="relative flex items-center justify-center font-medium">
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <LuUserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm font-medium text-secondary-plot">
            Already have an account?{" "}
            <Link
              to="/login"
              className={`underline underline-offset-4 ${
                formData.role === "tenant"
                  ? "text-primary-plot hover:text-primary-plot/80"
                  : "text-amber-700 hover:text-amber-800"
              }`}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 