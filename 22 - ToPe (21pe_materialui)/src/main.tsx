import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import AuthProvider from "./utils/AuthProvider.tsx";
import Layout from "./components/Layout.tsx";
import Koti from "./pages/Koti.tsx";
import NotFound from "./pages/NotFound.tsx";
import Tilat from "./pages/Tilat.tsx";
import Varaajat from "./pages/Varaajat.tsx";
import Varaukset from "./pages/Varaukset.tsx";
import Login from "./pages/Login.tsx";
import Logout from "./pages/Logout.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#BADA55" },
    secondary: { main: "#5542BA", contrastText: "#FFFFFF" },
  },
});

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Koti />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/tilat",
            element: <Tilat />,
          },
          {
            path: "/varaajat",
            element: <Varaajat />,
          },
          {
            path: "/varaukset",
            element: <Varaukset />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
