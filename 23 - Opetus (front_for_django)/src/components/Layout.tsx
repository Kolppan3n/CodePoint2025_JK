import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, Outlet } from "react-router";
import {
  CalendarMonth,
  Home,
  Login,
  Logout,
  MeetingRoom,
  Person,
} from "@mui/icons-material";
import { useAuth } from "../utils/AuthProvider";
import { Button } from "@mui/material";

const Layout = () => {
  const drawerWidth = 240;

  const pages = [
    { name: "Koti", path: "/", icon: <Home /> },
    { name: "Tilat", path: "/tilat", icon: <MeetingRoom /> },
    { name: "Varaajat", path: "/varaajat", icon: <Person /> },
    { name: "Varaukset", path: "/varaukset", icon: <CalendarMonth /> },
  ];

  const { isAuthenticated, userData } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tilavaraaja
          </Typography>
          {isAuthenticated ? (
            <Button component={Link} to="/logout" color="inherit" endIcon={<Logout />}>{userData ? userData.nimi : ""}</Button>
          ) : (
            <Button component={Link} to="/login" color="inherit" endIcon={<Login />}>Kirjaudu sisään</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {pages.map((page) => (
              <ListItemButton component={Link} to={page.path} key={page.name}>
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
