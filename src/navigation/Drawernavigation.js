import React from "react";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import { Dimensions, Image, TouchableOpacity } from "react-native";

const headerBackground = require("../../assets/images/topBarBg.png");
const backArrow = require("../../assets/icons/arrow-back.png");

import SideMenu from "../components/Sidemenu";
import { Colors, Fonts } from "../constants/index";

import Home from "../screen/Home/Home";
import AddCircleScreen from "../screen/AddCircle/AddCircle";
import JoinCircleScreen from "../screen/JoinCircle/JoinCircle";
import AddMemberScreen from "../screen/AddMember/AddMember";

const { width } = Dimensions.get("window");

const MainScreen = createStackNavigator(
  {
    Home: { screen: Home },
    AddCircle: { screen: AddCircleScreen },
    AddMember: { screen: AddMemberScreen },
    JoinCircle: { screen: JoinCircleScreen }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        titleStyle: {
          fontFamily: Fonts.primaryLight
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          borderBottomWidth: 0
        },
        headerBackground: (
          <Image
            style={{ flex: 1 }}
            source={headerBackground}
            resizeMode="cover"
          />
        ),
        headerTitleStyle: {
          color: Colors.white,
          fontFamily: Fonts.primaryRegular
        },
        headerTintColor: "#039298",
        headerLeft: props => (
          <TouchableOpacity
            onPress={props.onPress}
            style={{
              paddingLeft: 25
            }}
          >
            <Image
              source={backArrow}
              resizeMode="contain"
              style={{
                height: 20
              }}
            />
          </TouchableOpacity>
        )
      };
    }
  }
);

export default createDrawerNavigator(
  {
    Feed: {
      screen: MainScreen
    }
  },
  {
    contentComponent: SideMenu,
    drawerWidth: width * 0.84
  }
);
