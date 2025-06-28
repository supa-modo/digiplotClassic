import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { PiBuildingsBold, PiPasswordDuotone } from "react-icons/pi";
import {
  TbLoader2,
  TbCheck,
  TbAlertTriangle,
  TbArrowLeft,
  TbLock,
  TbSun,
  TbCalendarEvent,
} from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validToken, setValidToken] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("");

  // Set time of day greeting
  useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setValidToken(false);
    } else {
      setValidToken(true);
    }
  }, [token]);

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

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.resetPassword(
        token,
        formData.newPassword
      );

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(
          result.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <TbAlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new password reset.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-plot hover:bg-primary-plot/90"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* Left side - Elegant asymmetric design (same as login) */}
      <div className="hidden lg:block lg:w-7/12 relative">
        {/* Main background with gradient similar to Login */}
        <div className="absolute inset-0 bg-[#0a192f] overflow-hidden">
          {/* Enhanced glass morphism effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

          {/* Architectural line elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[10%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[20%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[40%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[60%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[70%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[80%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
            <div className="absolute top-[90%] left-0 w-full h-[1px] bg-white transform -rotate-[15deg]"></div>
          </div>

          {/* Accent color block */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-r from-transparent to-primary-600/80"></div>

          {/* Accent line */}
          <div className="absolute top-0 left-[10%] w-[1px] h-full bg-gradient-to-b from-primary-700 via-primary-400 to-transparent"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[2%]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-center p-16">
            <div className="max-w-3xl pl-24">
              {/* Logo area */}
              <div className="mb-16">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                    <PiBuildingsBold size={22} className="text-primary-700" />
                  </div>
                  <h1 className="text-3xl font-medium text-primary-400 tracking-wider">
                    DIGIPLOT
                  </h1>
                </div>
                <p className="mt-2 text-white/70 font-light tracking-wide">
                  PREMIUM PROPERTY MANAGEMENT
                </p>
              </div>

              {/* Main headline */}
              <h2 className="text-5xl font-light text-white leading-tight mb-6">
                <span className="">Reset</span> Your Password and{" "}
                <span className="text-amber-500">Secure</span> Your Account
              </h2>

              <p className="text-white/70 max-w-xl mb-12 leading-relaxed">
                Create a new strong password for your DigiPlot account. Make
                sure it's something secure that you'll remember.
              </p>

              {/* Feature points */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Strong password required
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Secure authentication process
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Immediate account access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Reset Password form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center p-6 sm:p-8 lg:p-16 relative">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 z-0 justify-center opacity-[6%]"
          style={{
            backgroundImage: `url("/bg.webp")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Mobile view header */}
        <div className="lg:hidden sm:mx-auto mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-secondary-plot rounded-sm flex items-center justify-center">
              <PiBuildingsBold size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-medium text-primary-500 tracking-wider">
              DIGIPLOT
            </h1>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-light tracking-wide">
            PREMIUM PROPERTY MANAGEMENT
          </p>
        </div>

        <div className="max-w-md w-full z-10 mx-auto">
          {!success ? (
            <>
              {/* Welcome section with time of day greeting */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center mb-3">
                  <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-secondary-plot text-[0.8rem] md:text-sm font-medium">
                    <TbSun className="h-4 w-4 mr-1.5 text-primary-plot" />
                    <span>Good {timeOfDay}</span>
                  </div>

                  <div className="flex items-center ml-4 text-[0.8rem] md:text-sm font-medium text-gray-600">
                    <TbCalendarEvent className="h-4 w-4 mr-1.5 text-secondary-plot" />
                    <span>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-secondary-plot mb-2">
                  Reset Password
                  <span className="ml-1 text-primary-plot">!</span>
                </h2>
                <p className="text-gray-500 text-[0.9rem] md:text-base">
                  Enter your new password below to reset your account password.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-3 md:mb-6 p-3 md:p-4 rounded-md border-l-4 border-red-500 bg-red-100/80 text-red-800/80 flex items-start">
                  <TbAlertTriangle className="h-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  <p className="text-xs md:text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Reset password form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* New Password field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-[0.8rem] md:text-sm font-medium text-secondary-plot mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <PiPasswordDuotone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-12 pr-12 py-3 text-sm md:text-base font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[0.8rem] md:text-sm font-medium text-secondary-plot mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <TbLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-12 pr-12 py-3 text-sm md:text-base font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="text-xs text-gray-500">
                  <p>Password must be at least 8 characters long.</p>
                </div>

                {/* Reset password button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group cursor-pointer relative w-full text-sm md:text-base overflow-hidden bg-gradient-to-r from-secondary-plot to-primary-plot text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  <span className="relative flex items-center justify-center font-medium">
                    {loading ? (
                      <>
                        <TbLoader2 className="animate-spin h-5 w-5 mr-2" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <TbLock className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Back to login link */}
              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-[0.8rem] md:text-sm font-medium text-primary-plot hover:text-primary-plot/80"
                >
                  <TbArrowLeft className="h-4 w-4 mr-1" />
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* Success message */
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TbCheck className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-secondary-plot mb-2">
                  Password Reset Successfully!
                </h2>
                <p className="text-gray-500 text-[0.9rem] md:text-base">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-xs md:text-sm text-green-800">
                  Redirecting you to the login page in a few seconds...
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center text-[0.8rem] md:text-sm font-medium text-primary-plot hover:text-primary-plot/80"
              >
                <TbArrowLeft className="h-4 w-4 mr-1" />
                Continue to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
