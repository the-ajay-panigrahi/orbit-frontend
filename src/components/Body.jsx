import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL, ALL_THEMES } from "../utils/constants";
import { addUser } from "../utils/userSlice";

export default function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(!user);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("orbit-theme") || "bumblebee";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit-theme", theme);
  }, [theme]);

  // 1. Initial session verification on mount/refresh
  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data.data));
      } catch (err) {
        // Not authenticated or token expired
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user, dispatch]);

  // 2. Global Route Guard: automatically redirects based on auth status
  useEffect(() => {
    if (isLoading) return;

    if (!user && location.pathname !== "/login") {
      // Unauthenticated user trying to access protected route (e.g. /feed)
      navigate("/login");
    } else if (user && location.pathname === "/login") {
      // Authenticated user trying to access /login
      navigate("/feed");
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col transition-colors duration-200">
      <Navbar theme={theme} onSelectTheme={setTheme} themes={ALL_THEMES} />
      <main className="flex-1 flex flex-col">
        <Outlet context={{ theme }} />
      </main>
      <Footer />
    </div>
  );
}


