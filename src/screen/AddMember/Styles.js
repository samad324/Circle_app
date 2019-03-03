import { Dimensions, StyleSheet } from "react-native";

import { Colors, Fonts } from "../../constants/index";

const { width, height } = Dimensions.get("window");

export const Styles = StyleSheet.create({
  menuBtn: {
    marginLeft: 10
  },
  headerTitleStyle: {
    textAlign: "center",
    flex: 1
  },
  headerStyle: {
    backgroundColor: Colors.blue,
    fontFamily: Fonts.primaryRegular
  },
  norBtn: {
    marginRight: 10
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
  heading: {
    color: Colors.dark,
    fontSize: 18,
    fontFamily: Fonts.primaryBold,
    marginTop: height * 0.16
  },
  input: {
    width: width * 0.8,
    marginTop: height * 0.02,
    borderRadius: 4
  },
  nextBtn: {
    marginTop: height * 0.02,
    backgroundColor: Colors.primaryLight,
    width: width * 0.6,
    height: height * 0.08,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.light,
    justifyContent: "center",
    alignItems: "center"
  },
  btnTxt: {
    color: Colors.light,
    fontFamily: Fonts.facon
  },
  code: {
    fontSize: 18,
    marginTop: height * 0.02,
    fontFamily: Fonts.primaryRegular,
    color: Colors.dark
  }
});
