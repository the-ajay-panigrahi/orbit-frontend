import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useTheme } from "../hooks/useTheme";

export default function Body() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(!user);
  const { theme, setTheme, themes } = useTheme();

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
        if (err?.response?.status !== 401) {
          console.error("Session check error:", err?.message || err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col transition-colors duration-200">
      <Navbar theme={theme} onSelectTheme={setTheme} themes={themes} />
      <main className="flex-1 flex flex-col">
        <Outlet context={{ theme, setTheme, themes }} />
      </main>
      <Footer />
    </div>
  );
}
