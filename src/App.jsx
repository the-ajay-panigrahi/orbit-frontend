import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import LandingPage from "./components/LandingPage";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import PrivateRoute from "./components/PrivateRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "feed",
            element: <Feed />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "connections",
            element: <Connections />,
          },
          {
            path: "requests",
            element: <Requests />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={appRouter} />;
}


