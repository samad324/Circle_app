import { Dimensions } from "react-native";

import { Colors, Fonts } from "../constants/index";

const { width, height } = Dimensions.get("window");

export const styles = {
  container: {
    flex: 1
  },
  userInfo: {
    flex: 1.3,
    backgroundColor: Colors.blue
  },
  backgroundStyles: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center"
  },
  followersContainer: {
    flex: 0.24,
    borderTopWidth: 0.5,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    borderTopColor: "#99999c",
    borderBottomWidth: 0.5,
    borderBottomColor: "#99999c",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  navLinks: {
    flex: 3
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginLeft: width * 0.05,
    borderColor: Colors.white,
    borderWidth: 4
  },
  username: {
    color: Colors.light,
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
    fontWeight: "bold",
    fontFamily: Fonts.primaryRegular
  },
  FollowContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  followTxt: {
    color: "#343439",
    fontSize: 14
  },
  smallContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: width * 0.11,
    marginTop: height * 0.04
  },
  navImg: {
    width: 30,
    height: 30,
    padding: 8
  },
  navTxt: {
    fontFamily: Fonts.primaryRegular,
    fontSize: width * 0.032,
    color: "#343439",
    paddingLeft: width * 0.05
  }
};
