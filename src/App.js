import React, { Component } from "react";
// import Home from "./screens/home/";
import StationHome from "./screens/station/";
import HubHome from "./screens/hubs/";
// import Login from "./screens/login/";

import { Toaster } from 'react-hot-toast';
import theme from './themes';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

export default class App extends Component {
  render(){
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HubHome />
        <Toaster />
      </ThemeProvider>
    )
  }
}
