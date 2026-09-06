import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
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
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={appRouter} />;
}

