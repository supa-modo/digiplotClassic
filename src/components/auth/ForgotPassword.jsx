import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { PiBuildingsBold } from "react-icons/pi";
import {
  TbMailFilled,
  TbLoader2,
  TbCheck,
  TbAlertTriangle,
  TbArrowLeft,
  TbSun,
  TbCalendarEvent,
} from "react-icons/tb";
import { FiCheck, FiCheckCircle } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");

  // Set time of day greeting
  useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.forgotPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(
          result.message ||
            "Failed to send reset email. Please check your email address and try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(
        error.message ||
          "Failed to send reset email. Please check your email address and try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
                <span className="">Secure</span> Password Recovery for your{" "}
                <span className="text-amber-500">Account</span>
              </h2>

              <p className="text-white/70 max-w-xl mb-12 leading-relaxed">
                Enter your email address and we'll send you a secure link to
                reset your password and regain access to your DigiPlot account.
              </p>

              {/* Feature points */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Secure password reset process
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Email verification required
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-[6px] h-[6px] bg-amber-500 rotate-45"></div>
                  <p className="text-white font-light">
                    Quick and easy recovery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forgot Password form */}
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
            <div className="w-10 h-10 bg-secondary-plot rounded-[0.32rem] flex items-center justify-center">
              <PiBuildingsBold size={28} className="text-white" />
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
          {/* logo */}

          <div className="hidden lg:flex text-center justify-center items-center space-x-3 mb-6 md:mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary-plot to-primary-700 rounded-[0.35rem] flex items-center justify-center">
              <PiBuildingsBold size={50} className="text-white" />
            </div>
          </div>

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
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-plot mb-4 md:mb-6">
            Forgot Your Password?
          </h2>
          {!success ? (
            <>
              {/* Welcome section with time of day greeting */}
              <div className="mb-6 md:mb-8">
                <p className="text-gray-500 text-[0.9rem] md:text-base">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-3 md:mb-6 p-3 md:p-4 rounded-md border-l-4 border-red-500 bg-red-100/80 text-red-800/80 flex items-start">
                  <TbAlertTriangle className="h-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  <p className="text-xs md:text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Forgot password form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[0.8rem] md:text-sm font-medium text-secondary-plot mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <TbMailFilled className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-3 py-3 text-sm md:text-base font-medium border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-plot focus:border-primary-plot bg-white text-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Send reset email button */}
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <TbMailFilled className="mr-2 h-5 w-5" />
                        <span className="text-sm md:text-[0.9rem]">
                          Send Reset Link
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </>
          ) : (
            /* Success message */
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-6">
                <div className="mb-6">
                  <FiCheckCircle className="h-10 md:h-12 w-10 md:w-12 text-primary-plot mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-primary-plot mb-2">
                    Check Your Email Inbox
                  </h2>
                  <p className="text-gray-500 text-[0.85rem] md:text-[0.95rem] ">
                    We've sent a password reset link to your email{" "}
                    <span className="text-primary-plot font-medium">
                      {email}
                    </span>
                  </p>
                </div>

                <p className="text-xs md:text-sm text-blue-700">
                  <strong>Didn't receive the email?</strong> Check your spam
                  folder or{" "}
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="underline hover:no-underline"
                  >
                    try again with a different email address
                  </button>
                </p>
              </div>
            </div>
          )}
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

          {/* Contact support link */}
          <div className="mt-8 text-center">
            <p className="text-[0.8rem] md:text-sm font-medium text-secondary-plot">
              Experiencing issues?{" "}
              <Link
                to="/contact"
                className={`underline underline-offset-4 ${"text-primary-plot hover:text-primary-plot/80"} `}
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright - should be aligned at the very bottom and center of page always */}
        <div className="mt-auto text-center absolute bottom-0 left-0 right-0 mb-4">
          <p className="text-[0.8rem] md:text-sm font-medium text-secondary-plot">
            &copy; {new Date().getFullYear()} DIGIPLOT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
