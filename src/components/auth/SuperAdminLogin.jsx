import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  TbShield,
  TbShieldCheck,
  TbLock,
  TbMail,
  TbLoader2,
  TbAlertTriangle,
  TbArrowLeft,
  TbKey,
  TbDatabase,
} from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PiSecurityCamera } from "react-icons/pi";

const SuperAdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [step, setStep] = useState(1); // 1 = login, 2 = 2FA

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handle2FACodeChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;
    if (value && !/^[0-9]$/.test(value)) return;

    const newCode = [...twoFactorCode];
    newCode[index] = value;
    setTwoFactorCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`admin-twoFactor-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handle2FAKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !twoFactorCode[index] && index > 0) {
      const prevInput = document.getElementById(`admin-twoFactor-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handle2FAPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 6).split("");

    const newCode = [...twoFactorCode];
    digits.forEach((digit, index) => {
      if (index < 6) newCode[index] = digit;
    });
    setTwoFactorCode(newCode);

    // Focus last filled input or next empty one
    const lastIndex = Math.min(digits.length - 1, 5);
    const targetInput = document.getElementById(`admin-twoFactor-${lastIndex}`);
    if (targetInput) targetInput.focus();
  };

  const goBackToLogin = () => {
    setStep(1);
    setRequires2FA(false);
    setTwoFactorCode(["", "", "", "", "", ""]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        // First step: email and password
        const result = await login(
          formData.email,
          formData.password,
          "admin",
          null // No 2FA token on first step
        );

        if (result.success) {
          navigate("/admin");
        } else if (result.requires2FA) {
          // Show 2FA step
          setStep(2);
          setRequires2FA(true);
          setError("");
        } else {
          setError(
            result.message ||
              "Access denied. Invalid administrator credentials."
          );
        }
      } else if (step === 2) {
        // Second step: 2FA verification
        const twoFactorToken = twoFactorCode.join("");

        if (twoFactorToken.length !== 6) {
          setError("Please enter all 6 digits of your authentication code.");
          setLoading(false);
          return;
        }

        const result = await login(
          formData.email,
          formData.password,
          "admin",
          twoFactorToken
        );

        if (result.success) {
          navigate("/admin");
        } else {
          setError(
            result.message ||
              "Invalid authentication code. Please check your authenticator app and try again."
          );
          // Clear the 2FA code on error
          setTwoFactorCode(["", "", "", "", "", ""]);
        }
      }
    } catch (error) {
      console.error("Super Admin login error:", error);
      setError(error.message || "Authentication failed. Please try again.");
      if (step === 2) {
        // Clear 2FA code on error
        setTwoFactorCode(["", "", "", "", "", ""]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
      {/* Security warning background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v2.5zm0 2.5v2H0v2h20v-2.5zm10 0V23H40v-2H30v2.5zM40 22H20v-2h20v2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="w-full max-w-md relative">
        {/* Security badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm border border-red-500/50 rounded-full px-4 py-2 mb-4">
            <TbShield className="h-5 w-5 text-red-400" />
            <span className="text-red-300 text-sm font-medium">
              RESTRICTED ACCESS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            System Administrator
          </h1>
          <p className="text-gray-300 text-sm">Authorized personnel only</p>
        </div>

        {/* Main login card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Logo section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-xl mb-4">
              <TbShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              DigiPlot Admin Console
            </h2>
            <p className="text-gray-300 text-sm">
              {step === 1
                ? "Enter your administrator credentials"
                : "Two-factor authentication required"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 flex items-start">
              <TbAlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              // Step 1: Email and Password
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Administrator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <TbMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-12 pr-4 py-3 text-white bg-white/10 border border-white/20 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="admin@digiplot.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Administrator Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <TbLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-12 pr-12 py-3 text-white bg-white/10 border border-white/20 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Step 2: Two-Factor Authentication
              <div className="space-y-6">
                <div className="text-center">
                  <TbKey className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Enhanced Security Required
                  </h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3 text-center">
                    Authentication Code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {twoFactorCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`admin-twoFactor-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handle2FACodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handle2FAKeyDown(index, e)}
                        onPaste={index === 0 ? handle2FAPaste : undefined}
                        className={`w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                          digit
                            ? "border-red-500 bg-red-500/20 text-white"
                            : "border-white/20 bg-white/10 text-gray-300"
                        } focus:border-red-400 focus:ring-2 focus:ring-red-500/20 backdrop-blur-sm`}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-400 text-center">
                    Check your authenticator app for the security code
                  </p>
                </div>

                {/* Back button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={goBackToLogin}
                    className="text-gray-300 hover:text-white text-sm flex items-center justify-center space-x-1 mx-auto"
                  >
                    <TbArrowLeft className="h-4 w-4" />
                    <span>Back to credentials</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
              <span className="relative flex items-center justify-center font-medium">
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>
                      {step === 1 ? "Authenticating..." : "Verifying..."}
                    </span>
                  </>
                ) : (
                  <>
                    <TbShieldCheck className="h-5 w-5 mr-2" />
                    <span>
                      {step === 1 ? "Secure Access" : "Verify & Enter"}
                    </span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Security features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <PiSecurityCamera className="h-4 w-4 text-red-400" />
                <span>End-to-end encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <TbDatabase className="h-4 w-4 text-red-400" />
                <span>Audit logged</span>
              </div>
            </div>
          </div>

          {/* Back to public site */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center space-x-1"
            >
              <TbArrowLeft className="h-4 w-4" />
              <span>Back to user login</span>
            </Link>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            This is a secure system. All access attempts are monitored and
            logged.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            &copy; {new Date().getFullYear()} DigiPlot System Administration
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
