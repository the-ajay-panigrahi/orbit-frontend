import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import LandingPage from "./components/LandingPage";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./components/chat/Chat";
import Terms from "./components/legal/Terms";
import Privacy from "./components/legal/Privacy";
import Refund from "./components/legal/Refund";
import Contact from "./components/legal/Contact";

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
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "refund",
        element: <Refund />,
      },
      {
        path: "contact",
        element: <Contact />,
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
          {
            path: "premium",
            element: <Premium />,
          },
          {
            path: "chat/:targetUserId",
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={appRouter} />;
}


