import React, { Component } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { Item, Input } from "native-base";

import { Colors } from "../../constants";
import { Styles } from "./Styles";
import { showToast, sendSms } from "../../config/helpers";
import { searchInDB } from "../../config/firebase";

export class AddMember extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Member",
      headerTintColor: Colors.light,
      headerTitleStyle: Styles.headerTitleStyle,
      headerStyle: Styles.headerStyle,
      headerRight: <TouchableOpacity style={Styles.norBtn} />
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      isload: true,
      number: "",
      circle: {},
      code: ""
    };
  }

  componentDidMount = async () => {
    const { code } = this.props.navigation.state.params;
    console.log(code);
    try {
      const circle = await searchInDB("circles", "code", code);
      this.setState({ circle: circle[0], isload: false, code });
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!", "danger");
    }
  };

  AddMember = async () => {
    const { number, code } = this.state;
    const { user } = this.props;

    this.setState({ isload: true });
    try {
      await sendSms(user.name, code, number);
      showToast("Invitation was send successfully!", "success");
      this.setState({ isload: false, number: "" });
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!", "danger");
    }
  };

  render() {
    const { isload, number, circle } = this.state;
    return isload ? (
      <ActivityIndicator color={Colors.primaryLight} size="large" />
    ) : (
      <View style={Styles.container}>
        <Text style={Styles.heading}>Enter phone number to add a member..</Text>
        <Text style={[Styles.heading, { marginTop: 12 }]}>
          Circle: {circle.name}
        </Text>
        <Item regular style={Styles.input}>
          <Input
            placeholder="Phone number.."
            keyboardType="numeric"
            value={number}
            placeholderTextColor={Colors.dark}
            style={{ color: Colors.dark }}
            onChangeText={number => this.setState({ number })}
          />
        </Item>
        <View>
          <TouchableOpacity style={Styles.nextBtn} onPress={this.AddMember}>
            {isload ? (
              <ActivityIndicator color={Colors.light} size="large" />
            ) : (
              <Text style={Styles.btnTxt}>Add member</Text>
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

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMember);
