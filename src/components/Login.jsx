import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
  Orbit,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Quote,
} from "lucide-react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Login() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLoginForm, setIsLoginForm] = useState(mode !== "signup");

  useEffect(() => {
    if (mode === "signup") {
      setIsLoginForm(false);
    } else if (mode === "signin" || mode === "login") {
      setIsLoginForm(true);
    }
  }, [mode]);

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
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (user && !hasSubmitted.current) {
      navigate("/feed");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    hasSubmitted.current = true;

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

      if (isLoginForm) {
        navigate("/feed");
      } else {
        navigate("/profile", { state: { welcome: true } });
      }
    } catch (err) {
      hasSubmitted.current = false;
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Authentication failed. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (isLogin) => {
    setError("");
    setIsLoginForm(isLogin);
    navigate(`/login?mode=${isLogin ? "signin" : "signup"}`, { replace: true });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Orbit Brand Showcase (Desktop / Tablet) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6">
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-100 border border-base-content/10 shadow-xs text-xs font-semibold text-base-content/80 w-fit">
            <Orbit className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "12s" }} />
            <span>Orbit Builder Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-base-content leading-tight">
            Find the people who{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
              move with you.
            </span>
          </h1>

          <p className="text-sm text-base-content/70 leading-relaxed max-w-md">
            The dedicated collaboration space where technical founders, software engineers, and product builders connect to build the next generation of products.
          </p>

          {/* Builder Testimonial Card */}
          <div className="card bg-base-100 border border-base-content/10 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-base-content/10 pointer-events-none">
              <Quote className="w-12 h-12" />
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed italic relative z-10">
              "Orbit cut through the cold DM noise of LinkedIn and Twitter. I connected with my technical co-founder within 48 hours, and we shipped our v1 MVP together."
            </p>
            <div className="flex items-center gap-3 pt-1 relative z-10">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full ring-2 ring-primary/30 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop&crop=faces"
                    alt="Sarah Guo"
                  />
                </div>
              </div>
              <div className="text-xs">
                <p className="font-bold text-base-content">Sarah Guo</p>
                <p className="text-[11px] text-base-content/60">Founder @ Conviction • AI Systems</p>
              </div>
            </div>
          </div>

          {/* Value Proof Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-base-100/60 border border-base-content/10">
              <ShieldCheck className="w-4 h-4 text-success mx-auto mb-1.5" />
              <p className="font-semibold text-base-content text-[11px]">Verified</p>
              <p className="text-[10px] text-base-content/50">Builder profiles</p>
            </div>
            <div className="p-3 rounded-xl bg-base-100/60 border border-base-content/10">
              <Zap className="w-4 h-4 text-warning mx-auto mb-1.5" />
              <p className="font-semibold text-base-content text-[11px]">Zero Spam</p>
              <p className="text-[10px] text-base-content/50">Mutual opt-in</p>
            </div>
            <div className="p-3 rounded-xl bg-base-100/60 border border-base-content/10">
              <Users className="w-4 h-4 text-primary mx-auto mb-1.5" />
              <p className="font-semibold text-base-content text-[11px]">500+ Active</p>
              <p className="text-[10px] text-base-content/50">Founders online</p>
            </div>
          </div>
        </div>

        {/* Right Column: Redesigned Auth Card */}
        <div className="w-full lg:col-span-6 flex justify-center">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/10 rounded-3xl overflow-hidden">
            {/* Top Mode Segmented Switcher */}
            <div className="p-4 sm:p-5 pb-0">
              <div className="grid grid-cols-2 p-1 bg-base-200/80 rounded-2xl border border-base-content/5">
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isLoginForm
                      ? "bg-base-100 text-base-content shadow-xs"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isLoginForm
                      ? "bg-base-100 text-base-content shadow-xs"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            <div className="card-body p-6 sm:p-7 pt-4 gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold tracking-tight text-base-content flex items-center justify-center sm:justify-start gap-2">
                  <span>{isLoginForm ? "Welcome back" : "Join the Orbit Network"}</span>
                </h2>
                <p className="text-xs text-base-content/60 mt-1">
                  {isLoginForm
                    ? "Enter your credentials to access your feed and requests."
                    : "Create your builder profile to discover and match with partners."}
                </p>
              </div>

              {error && (
                <div className="alert alert-error text-xs py-2.5 px-3 rounded-xl flex items-center gap-2 shadow-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {!isLoginForm && (
                  <div className="grid grid-cols-2 gap-2.5">
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
                          className="input input-sm input-bordered w-full pl-8 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-xl"
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
                          className="input input-sm input-bordered w-full pl-8 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-control">
                  <label className="label py-0.5">
                    <span className="label-text text-xs font-semibold text-base-content/80">
                      Email Address
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
                      className="input input-sm input-bordered w-full pl-9 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-xl"
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
                      className="input input-sm input-bordered w-full pl-9 pr-9 text-xs text-base-content bg-base-200/50 focus:bg-base-100 rounded-xl"
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
                  className="btn btn-sm sm:btn-md btn-primary w-full mt-2 gap-2 shadow-md shadow-primary/20 rounded-xl cursor-pointer font-semibold"
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
                      onClick={() => switchMode(false)}
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
                      onClick={() => switchMode(true)}
                      className="link link-primary font-semibold cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

              {/* Reassurance footnote */}
              <p className="text-[10px] text-center text-base-content/40 border-t border-base-content/5 pt-2">
                By continuing, you agree to Orbit's Community Code of Conduct for verified builders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
