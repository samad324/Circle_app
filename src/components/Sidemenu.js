import PropTypes from "prop-types";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";
import { Toast } from "native-base";
import { Location } from "expo";

import { styles } from "./SideMenu.Style";
import { onLogout } from "../store/actions/authAction";
import { logout } from "../config/firebase";

const LOCATION_TASK = "background-location";

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ user: user || {} });
  }

  navigateToScreen = route => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  };

  logout = async () => {
    const { onLogout } = this.props;
    try {
      await logout();
      await onLogout();
      await Location.stopLocationUpdatesAsync(LOCATION_TASK);
      this.navigateTo("Login");
    } catch (error) {
      console.log(error);
      Toast.show({
        text: "Something went wrong!",
        buttonText: "Okay",
        type: "danger"
      });
    }
  };

  navigateTo = route => {
    const { navigate } = this.props.navigation;
    return navigate(route);
  };

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <ImageBackground
            source={require("../../assets/images/background.png")}
            resizeMode="cover"
            style={styles.backgroundStyles}
          >
            <Image
              source={{ uri: user.photo }}
              resizeMode="cover"
              style={styles.avatar}
            />
            <Text style={styles.username}>{user.name}</Text>
          </ImageBackground>
        </View>

        <View style={styles.navLinks}>
          <TouchableOpacity
            style={styles.nav}
            onPress={() => this.navigateToScreen("Home")}
          >
            <Image
              source={require("../../assets/icons/map_icon.png")}
              style={styles.navImg}
              resizeMode="contain"
            />
            <Text style={styles.navTxt}>My map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nav}
            onPress={() => this.navigateToScreen("AddCircle")}
          >
            <Image
              source={require("../../assets/icons/join_nav.png")}
              style={styles.navImg}
              resizeMode="contain"
            />
            <Text style={styles.navTxt}>Add a circle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nav}
            onPress={() => this.navigateToScreen("Profile")}
          >
            <Image
              source={require("../../assets/icons/user_profile.png")}
              style={styles.navImg}
              resizeMode="contain"
            />
            <Text style={styles.navTxt}>My profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nav} onPress={this.logout}>
            <Image
              source={require("../../assets/icons/logout.png")}
              style={styles.navImg}
              resizeMode="contain"
            />
            <Text style={styles.navTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.authReducer.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(onLogout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
