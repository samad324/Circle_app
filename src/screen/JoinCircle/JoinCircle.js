import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import { connect } from "react-redux";
import { Item, Input, Icon } from "native-base";

import { Colors } from "../../constants";
import { Styles } from "./Styles";
import { showToast, getLocationAsync } from "../../config/helpers";
import {
  addToDB,
  updateDB,
  updateCircleLocationsInDB,
  searchInDB
} from "../../config/firebase";
import { updateUser } from "../../store/actions/authAction";

export class AddMember extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Join Circle",
      headerTintColor: Colors.light,
      headerTitleStyle: Styles.headerTitleStyle,
      headerStyle: Styles.headerStyle,
      headerRight: <TouchableOpacity style={Styles.norBtn} />
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      isload: false,
      code: ""
    };
  }

  componentDidMount = async () => {};

  JoinCircle = async () => {
    const { code } = this.state;
    const { user, updateUser } = this.props;
    if (!code) {
      return showToast("Please enter circle code!", "warning");
    }
    this.setState({ isload: true });
    try {
      const circleResult = await searchInDB("circles", "code", code);
      if (!circleResult.length) {
        this.setState({ isload: false });
        return showToast("Your entered circle code is invalid!", "danger");
      }

      if (
        circleResult[0].members.includes(user.uid) ||
        circleResult[0].admin.includes(user.uid)
      ) {
        this.setState({ isload: false });
        return showToast("You're aleady a member of this circle!", "warning");
      }

      const circle = {
        name: circleResult[0].name,
        code: circleResult[0].code
      };
      const circles = user.circles;
      circles.push(circle);

      circleResult[0].members.push(user.uid);

      const location = await getLocationAsync();
      const locationData = {
        location,
        uid: user.uid,
        timeStamp: Date.now(),
        pushToken: user.pushToken
      };

      console.log(circles, circleResult[0], locationData, circles);
      await updateDB("circles", code, circleResult[0]);
      await updateDB("users", user.uid, { circles });
      await updateCircleLocationsInDB(code, locationData);
      await updateUser({ circles });
      this.setState({ isload: false, code: "" });
    } catch (error) {
      console.log(error);
      showToast("Please enter circle code!", "warning");
    }
  };
  render() {
    const { isload, code } = this.state;
    return isload ? (
      <ActivityIndicator color={Colors.primaryLight} size="large" />
    ) : (
      <View style={Styles.container}>
        <Text style={Styles.heading}>Enter circle code..</Text>
        <Item regular style={Styles.input}>
          <Image
            source={require("../../../assets/icons/hash.png")}
            style={{ width: 18, height: 18, marginLeft: 8 }}
          />
          <Input
            placeholder="Enter code.."
            value={code}
            placeholderTextColor={Colors.dark}
            style={{ color: Colors.dark }}
            onChangeText={code => this.setState({ code })}
          />
        </Item>
        <View>
          <TouchableOpacity style={Styles.nextBtn} onPress={this.JoinCircle}>
            {isload ? (
              <ActivityIndicator color={Colors.light} size="large" />
            ) : (
              <Text style={Styles.btnTxt}>Join circle</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  updateUser: paylaod => dispatch(updateUser(paylaod))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMember);
