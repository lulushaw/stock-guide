import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Encyclopedia from "./pages/Encyclopedia";
import DataQuery from "./pages/DataQuery";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Home />,
    },
    {
      path: "/login",
      name: 'login',
      element: <Login />,
    },
    {
      path: "/register",
      name: 'register',
      element: <Register />,
    },
    {
      path: "/quiz",
      name: 'quiz',
      element: <Quiz />,
    },
    {
      path: "/encyclopedia",
      name: 'encyclopedia',
      element: <Encyclopedia />,
    },
    {
      path: "/data-query",
      name: 'data-query',
      element: <DataQuery />,
    },
    {
      path: "/admin",
      name: 'admin',
      element: <Admin />,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;