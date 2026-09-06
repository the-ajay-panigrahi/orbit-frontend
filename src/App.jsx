import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Body from "./components/Body";
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
        path: "login",
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/feed" replace />,
          },
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


