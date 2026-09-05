import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      navigate("/feed");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong while logging in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body p-6 sm:p-8 gap-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              Welcome back
            </h1>
            <p className="text-xs text-base-content/60 mt-1">
              Find people you actually want to work and connect with
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-xs py-2 px-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label pb-1">
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
                  className="input input-bordered w-full pl-9 text-sm text-base-content bg-base-200/50 focus:bg-base-100"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1 flex justify-between">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Password
                </span>
                <a
                  href="#forgot"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot?
                </a>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-9 text-sm text-base-content bg-base-200/50 focus:bg-base-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>

          <div className="divider text-[11px] text-base-content/40 my-0 uppercase">
            Or
          </div>

          <Link
            to="/feed"
            className="btn btn-ghost btn-outline border-base-content/15 w-full text-xs gap-1.5"
          >
            <span>Explore Orbit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
