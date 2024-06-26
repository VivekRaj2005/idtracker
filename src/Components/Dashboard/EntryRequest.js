import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import "../../Style/Dash.css";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import LockIcon from "@mui/icons-material/Lock";
import Requests from "./Requests";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function EntryRequest(props) {
  const [data, setData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const navigate = useNavigate();
  const [random, setRandom] = useState(null);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [reason, setReason] = useState("");
  const [Notifications, setNotifications] = useState(0);

  async function CountNotification() {
    const querySnapshot1 = await getDocs(
      query(collection(db, "Database (Resident)"), where("In", "==", false))
    );
    var c = 0;
    querySnapshot1.forEach((doc) => {
      var data = doc.data();
      var date = data.LastOut.toDate();
      if (datediff(date, new Date()) >= 30) {
        c += 1;
      }
    });
    const querySnapshot2 = await getDocs(
      query(
        collection(db, "Dataset (Visitor Application)"),
        where("In", "==", true)
      )
    );
    querySnapshot2.forEach((doc) => {
      var data = doc.data();
      if (datediff(new Date(), data["Date of Exit"].toDate()) < 0) {
        c += 1;
      }
    });
    setNotifications(c);
  }

  async function handleDeleteElement(name, email, docid) {
    var result = await withReactContent(Swal).fire({
      title: <b>Reject User?</b>,
      input: "text",
      showCancelButton: true,
      icon: "question",
      reason,
      preConfirm: () => {
        setReason(Swal.getInput()?.value || "");
      },
    });
    console.log(result, reason);
    if (!result.isDismissed) {
      await deleteDoc(doc(db, "Dataset (Visitor Application)", docid));
    }

    const currentData = {
      Name: name,
      Email: email,
      Track: docid ,
      Reason: result.value
    }
    var sendData = new FormData();
    for( var key in currentData )
    {
      sendData.append(key, currentData[key])
    }
    await fetch('https://script.google.com/macros/s/AKfycbxO1uIb2WbHbmrM17GTKGmokboD1XVPJqBOkLLYodNwbE_beeUZIdyI0VBwBnmj3nzT/exec', {
      method: "POST",
      mode:'no-cors',
      body: sendData
    })
    var myr = [];
    var c = 0;
    // const querySnapshot = await getDocs(query(collection(db, "Dataset (Visitor Application)"), where('Date of Exit', '>', dayjs().unix()) ));
    const querySnapshot = await getDocs(
      collection(db, "Dataset (Visitor Application)")
    );
    querySnapshot.forEach((doc) => {
      c += 1;
      var cdata = doc.data();
      if (cdata["Date of Exit"].toDate() > new Date()) {
        myr.push({
          id: c,
          name: cdata.Name,
          email: cdata.Email,
          reason: cdata["Reason For Entry"],
          entry: String(cdata["Date of Entry"].toDate()),
          exit: String(cdata["Date of Exit"].toDate()),
          docid: doc.id,
        });
      } else {
        console.log(String(cdata["Date of Exit"].toDate()));
      }
    });
    console.log(myr);
    setData(myr);
    console.log("done");
  }

  async function handleSetData() {
    if (!gotData) {
      CountNotification()
      var myr = [];
      var c = 0;
      // const querySnapshot = await getDocs(query(collection(db, "Dataset (Visitor Application)"), where('Date of Exit', '>', dayjs().unix()) ));
      const querySnapshot = await getDocs(
        collection(db, "Dataset (Visitor Application)")
      );
      querySnapshot.forEach((doc) => {
        c += 1;
        var cdata = doc.data();
        if (cdata["Date of Exit"].toDate() > new Date()) {
          myr.push({
            id: c,
            name: cdata.Name,
            email: cdata.Email,
            reason: cdata["Reason For Entry"],
            entry: String(cdata["Date of Entry"].toDate()),
            exit: String(cdata["Date of Exit"].toDate()),
            docid: doc.id,
          });
        } else {
          console.log(String(cdata["Date of Exit"].toDate()));
        }
      });
      console.log(myr);
      setData(myr);
      setGotData(true);
    }
  }
  useEffect(() => {
    if (props.securityData != null) {
      console.log(props.securityData);
    } else {
      console.log(props.securityData);
      navigate("/security/login");
    }
    handleSetData();
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            {props.securityData.Username == "Admin" ? (
              <IconButton
                color="inherit"
                onClick={() => {
                  console.log("Clicked");
                  navigate("/security/notif");
                }}
              >
                <Badge badgeContent={Notifications} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            ) : (
              <></>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <ListItemButton onClick={() => navigate("/security/dashboard")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              {props.securityData.Username == "Admin" ? (
                <>
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Entry Requests" />
                  </ListItemButton>
                  <ListItemButton onClick={() => {navigate('/security/notif')}}>
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate("/security/addr")}>
                    <ListItemIcon>
                      <PersonAddAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Resident" />
                  </ListItemButton>
                </>
              ) : (
                <></>
              )}
              <ListItemButton onClick={() => navigate("/security/qr/entry")}>
                <ListItemIcon>
                  <AddLocationAltIcon />
                </ListItemIcon>
                <ListItemText primary="Entry Scan" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/security/qr/exit")}>
                <ListItemIcon>
                  <LocationOffIcon />
                </ListItemIcon>
                <ListItemText primary="Exit Scan" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.setSecurityData(null);
                  navigate("/security/login");
                }}
              >
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </React.Fragment>
            {props.securityData.Username == "Admin" ? (
              <>
                <Divider sx={{ my: 1 }} />
                <React.Fragment>
                  <ListSubheader component="div" inset>
                    Generate Reports
                  </ListSubheader>
                  <ListItemButton onClick={() => {navigate("/security/log/login")}}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Security Login" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="I/P O/P Register" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Approval" />
                  </ListItemButton>
                </React.Fragment>
              </>
            ) : (
              <></>
            )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Requests
                    data={data}
                    handleDeleteElement={handleDeleteElement}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
