import { Dimensions } from "react-native";

import { Colors, Fonts } from "../../constants/index";

const { width, height } = Dimensions.get("window");

export const Styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imagePickerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  fieldsContainer: {
    flex: 2
  },
  imagePicker: {
    backgroundColor: Colors.blue,
    width: 160,
    height: 160,
    borderWidth: 4,
    borderColor: Colors.blue,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.04
  },
  pickerImage: {
    width: 100,
    height: 100
  },
  userImage: {
    width: 160,
    height: 160,
    borderColor: Colors.blue,
    borderWidth: 0.1,
    borderRadius: 10000
  },
  joinedFields: {
    width: width,
    flexDirection: "row",
    paddingLeft: width * 0.07,
    paddingRight: width * 0.08
  },
  inputSeperator: {
    borderRightWidth: 1,
    borderRightColor: "#99999c",
    height: 26
  },
  inputFieldsWrapper: {
    paddingLeft: width * 0.07,
    paddingRight: width * 0.08,
    marginTop: height * 0.026,
    width: width
  },
  signupBtnContainer: {
    alignItems: "center"
  },
  signupBtn: {
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 42,
    height: 56
  },
  headerStyle: {
    textAlign: "center",
    flex: 1,
    marginRight: width * 0.2
  },
  nextBtn: {
    alignSelf: "center",
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
  }
};
