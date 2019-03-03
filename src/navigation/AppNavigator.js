import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from "./Navigation";
import DrawerNavigation from "./Drawernavigation";
import SignUp from "../screen/Signup/Signup";

export default createAppContainer(
  createSwitchNavigator({
    Login,
    SignUp,
    WithDrawer: DrawerNavigation
  })
);
