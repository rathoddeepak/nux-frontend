import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";

import CssBaseline from "@mui/material/CssBaseline";
import StationHome from "./screens/station/";
import HubHome from "./screens/hubs/";
import Framer from "./screens/framer/";
import Login from "./screens/login/";
import Test from "./screens/home/";
import theme from "./themes";
import DB from "./db/";


const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const stationId = DB.Account.getStationId();
    const hubId = DB.Account.getHubId();
    if(stationId && stationId !== "0"){
      navigate("station/" + stationId);
    }else if(hubId && hubId !== "0"){
      navigate("station/" + hubId);
    }else{
      navigate("login");
    }
  });
  return (<div />)
}

const App = () => {  
  return (
     <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hub/*" element={<HubHome />} />
            <Route path="/station/*" element={<StationHome />} />
            <Route path="/framer/*" element={<Framer />} />            
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
  )
}

export default App;