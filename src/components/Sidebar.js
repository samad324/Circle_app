import React, { Component } from "react";
import Router from "../navigation/Drawernavigation";
import { AppRegistry } from "react-native";

export default class CustomDrawer extends Component {
  render() {
    return <Router />;
  }
}

AppRegistry.registerComponent("CustomDrawer", () => CustomDrawer);
