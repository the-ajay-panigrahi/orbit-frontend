import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL, ALL_THEMES } from "../utils/constants";
import { addUser } from "../utils/userSlice";

export default function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("orbit-theme") || "bumblebee";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data.data));
      } catch (err) {
        if (err?.response?.status === 401 || err?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [user, dispatch, navigate]);

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

