import React, { Component } from "react";
import { View, ActivityIndicator, ImageBackground, Image } from "react-native";
import { connect } from "react-redux";
import { Button } from "native-base";

import { Styles } from "./Styles";
// import Button from "../../components/Button";
import { loginWithFacebook } from "../../config/firebase";
import { onLogin } from "../../store/actions/authAction";
import fbIcon from "../../../assets/icons/facebook.png";
import { showToast } from "../../config/helpers";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    const { user } = this.props;
    const { navigate } = this.props.navigation;
    if (user && user.isNew) {
      return navigate("SignUp");
    } else if (user && !user.isNew) {
      return navigate("WithDrawer");
    }
    this.setState({ isLoading: false });
  }

  login = async () => {
    const { onLogin } = this.props;

    this.setState({ isLoading: true });

    try {
      const res = await loginWithFacebook();
      onLogin(res);
      this.setState({ isLoading: false });
      console.log(res);
      if (res.isNew) {
        return this.navigateToHome("SignUp");
      }
      this.navigateToHome("WithDrawer");
    } catch (e) {
      showToast(e.message, "danger");
      this.setState({ isLoading: false });
    }
  };

  navigateToHome = route => {
    const { navigate } = this.props.navigation;
    return navigate(route);
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={Styles.mainContainer}>
        <ImageBackground
          source={require("../../../assets/images/splash_2.png")}
          style={Styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={Styles.btnContainer}>
            <Button
              rounded
              bordered
              style={Styles.socialButton}
              onPress={this.login}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <Image
                  source={fbIcon}
                  style={Styles.fbIcon}
                  resizeMode="contain"
                />
              )}
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authReducer.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: payload => dispatch(onLogin(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
