import React, { Component } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { Item, Input } from "native-base";
import randomHax from "crypto-random-hex";

import { Colors } from "../../constants";
import { Styles } from "./Styles";
import { showToast, getLocationAsync } from "../../config/helpers";
import {
  addToDB,
  updateDB,
  updateCircleLocationsInDB
} from "../../config/firebase";
import { updateUser } from "../../store/actions/authAction";

export class componentName extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Circle",
      headerTintColor: Colors.light,
      headerTitleStyle: Styles.headerTitleStyle,
      headerStyle: Styles.headerStyle,
      headerRight: <TouchableOpacity style={Styles.norBtn} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      circleName: "",
      code: "",
      isload: false
    };
  }

  onNext = async () => {
    const { circleName } = this.state;
    if (!circleName) {
      return showToast("Please enter circle name first!", "danger");
    }
    const code = await randomHax(3);
    this.setState({ code });
  };

  createCircle = async () => {
    const { circleName, code } = this.state;
    const { user, updateUser, navigation } = this.props;

    this.setState({ isload: true });
    const cirleData = {
      name: circleName,
      code,
      admin: [user.uid],
      timeStamp: Date.now(),
      members: []
    };
    const circle = {
      name: circleName,
      code
    };

    const circles = user.circles;
    circles.push(circle);
    try {
      const location = await getLocationAsync();
      const locationData = {
        location,
        uid: user.uid,
        photo: user.photo,
        name: user.name,
        timeStamp: Date.now(),
        pushToken: user.pushToken
      };

      await addToDB("circles", cirleData);
      await updateDB("users", user.uid, { circles });
      await updateCircleLocationsInDB(code, locationData);
      await updateUser({ circles });
      this.setState({ isload: false });
      navigation.navigate("Home", { activeCircle: circle });
    } catch (error) {
      this.setState({ isload: false });
      console.log(error);
      showToast("Something went wrong!", "danger");
    }
  };

  render() {
    const { circleName, code, isload } = this.state;
    return (
      <View style={Styles.container}>
        <Text style={Styles.heading}> Enter your circle name </Text>
        <Item regular style={Styles.input}>
          <Input
            placeholder="Circle name.."
            value={circleName}
            placeholderTextColor={Colors.dark}
            style={{ color: Colors.dark }}
            onChangeText={circleName => this.setState({ circleName })}
          />
        </Item>
        {!!code && <Text style={Styles.code}>Code: {code}</Text>}
        <TouchableOpacity
          style={Styles.nextBtn}
          onPress={!code ? this.onNext : this.createCircle}
        >
          {isload ? (
            <ActivityIndicator color={Colors.light} size="large" />
          ) : code ? (
            <Text style={Styles.btnTxt}>Create Circle</Text>
          ) : (
            <Text style={Styles.btnTxt}>Generate Code</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  updateUser: payload => dispatch(updateUser(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentName);
