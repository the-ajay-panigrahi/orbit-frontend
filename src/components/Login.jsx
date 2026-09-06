import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLoginForm ? "/login" : "/signup";
      const payload = isLoginForm
        ? { email, password }
        : {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
          };

      const res = await axios.post(`${BASE_URL}${endpoint}`, payload, {
        withCredentials: true,
      });

      if (res?.data?.data) {
        dispatch(addUser(res.data.data));
      }

      // If signing up, take them directly to profile to customize bio/skills; if logging in, go to feed
      navigate(isLoginForm ? "/feed" : "/profile");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Authentication failed. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleForm = () => {
    setError("");
    setIsLoginForm((prev) => !prev);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body p-6 sm:p-8 gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              {isLoginForm ? "Welcome back" : "Join Orbit"}
            </h1>
            <p className="text-xs text-base-content/60 mt-1">
              {isLoginForm
                ? "Find people you actually want to work and connect with"
                : "Create an account and connect with top founders & builders"}
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-xs py-2 px-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                  <label className="label py-0.5">
                    <span className="label-text text-xs font-semibold text-base-content/80">
                      First Name
                    </span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={50}
                      placeholder="Elon"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-sm input-bordered w-full pl-8 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-lg"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label py-0.5">
                    <span className="label-text text-xs font-semibold text-base-content/80">
                      Last Name
                    </span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="Musk"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input input-sm input-bordered w-full pl-8 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label py-0.5">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Email
                </span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-sm input-bordered w-full pl-9 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-lg"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-0.5">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Password
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-sm input-bordered w-full pl-9 pr-9 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-sm btn-primary w-full mt-2 gap-2 shadow-md shadow-primary/20 cursor-pointer"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : isLoginForm ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>
                {loading
                  ? isLoginForm
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLoginForm
                  ? "Sign In"
                  : "Create Account"}
              </span>
            </button>
          </form>

          <div className="text-center text-xs text-base-content/70 pt-1">
            {isLoginForm ? (
              <p>
                New to Orbit?{" "}
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="link link-primary font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="link link-primary font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
