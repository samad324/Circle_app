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
    // shadowOpacity: 0,
    // shadowOffset: {
    //   height: 0
    // },
    // elevation: 0,
    // shadowRadius: 0,
    fontFamily: Fonts.primaryRegular
  },
  norBtn: {
    marginRight: 10
  },
  container: {
    flex: 1
  },
  mapBtns: {
    position: "absolute",
    bottom: height * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width,
    paddingLeft: width * 0.01
  },
  smallBtns: {
    margin: 10,
    width: 40,
    height: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 1000
  },
  iconImg: {
    height: 30,
    width: 30
  },
  allCirclesDown: {
    position: "absolute",
    top: height * 0.02,
    width: width * 0.9,
    height: height * 0.08,
    alignSelf: "center",
    backgroundColor: Colors.light,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 4
  },
  dropDown: {
    width: width * 0.8
  },
  btnDanger: {
    margin: 10,
    width: 70,
    height: 70,
    backgroundColor: Colors.dark,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.red,
    borderWidth: 4,
    borderRadius: 1000
  }
});
