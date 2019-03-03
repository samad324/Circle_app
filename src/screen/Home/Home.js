import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import { Button, Icon, Item, Picker } from "native-base";

import { Colors } from "../../constants/index";
import { Styles } from "./Styles";
import { getLocationAsync, showToast } from "../../config/helpers";
import firebase, {
  searchInDB,
  updateCircleLocationsInDB
} from "../../config/firebase";

export class componentName extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Circle",
      headerTintColor: Colors.light,
      headerTitleStyle: Styles.headerTitleStyle,
      headerStyle: Styles.headerStyle,
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            params.selectedCircle
              ? params.isAdmin
                ? navigation.navigate("AddMember", {
                    code: params.selectedCircle
                  })
                : showToast("You are not admin! ", "warning")
              : showToast("Please select a circle first", "warning")
          }
          style={Styles.norBtn}
        >
          <Image source={require("../../../assets/icons/add_user_3.png")} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={Styles.menuBtn}
        >
          <Image source={require("../../../assets/icons/menu.png")} />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      currentLocation: {},
      isload: true,
      selectedCircle: "",
      markers: []
    };
  }

  componentDidMount = async () => {
    const currentLocation = await getLocationAsync();
    this.watchLocation();
    this.setState({ currentLocation, isload: false });
    this.props.navigation.setParams({
      selectedCircle: ""
    });
  };

  onCircleChange = async selectedCircle => {
    this.props.navigation.setParams({
      selectedCircle: selectedCircle
    });

    this.setState({ selectedCircle });
    if (this.listner) {
      this.listner();
    }
    this.listner = await firebase
      .firestore()
      .collection("circlesLocations")
      .doc(selectedCircle)
      .collection("locations")
      .onSnapshot(querySnapshot => {
        const markers = [];
        querySnapshot.forEach(doc => {
          markers.push(doc.data());
        });
        console.log(markers);
        this.setState({ markers });
      });

    const isAdmin = await this.getCircle(selectedCircle);
    this.props.navigation.setParams({ selectedCircle, isAdmin });
    this.setState({ isAdmin });
  };

  getCircle = async selectedCircle => {
    const { user } = this.props;
    try {
      const circle = await searchInDB("circles", "code", selectedCircle);
      const isAdmin = await circle[0].admin.includes(user.uid);
      return circle[0], isAdmin;
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!", "danger");
    }
  };

  watchLocation = async () => {
    const { user } = this.props;
    const { markers } = this.state;
    try {
      this.interval = setInterval(async () => {
        const location = await getLocationAsync();
        user.circles.map(async ({ code }) => {
          const data = {
            location,
            timeStamp: Date.now(),
            uid: user.uid
          };
          await updateCircleLocationsInDB(code, data);
        });
      }, 10000);
    } catch (e) {
      console.log(e);
      showToast(e.message, "danger");
    }
  };

  resetMap = async () => {
    const currentLocation = await getLocationAsync();
    this.setState({ currentLocation });
  };

  navigate = (route, prop) => {
    const { navigate } = this.props.navigation;
    navigate(route, prop);
  };

  renderMap = () => {
    const { currentLocation, markers } = this.state;
    const { user } = this.props;
    return (
      <View style={Styles.container}>
        <MapView
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0121,
            longitudeDelta: 0.015
          }}
          showsCompass
          followsUserLocation
          showsUserLocation
          style={{ flex: 1 }}
          loadingEnabled={true}
          zoomEnabled={true}
        >
          {this.generateMarkers(markers)}
        </MapView>
        <View style={Styles.allCirclesDown}>
          {this.renderCircleDropDown(user ? user.circles : [])}
        </View>
        <View style={Styles.mapBtns}>
          <TouchableOpacity
            style={Styles.smallBtns}
            onPress={() => this.navigate("JoinCircle", {})}
          >
            <Image
              source={require("../../../assets/icons/join.png")}
              style={Styles.iconImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.smallBtns}
            onPress={() => this.navigate("AddCircle", {})}
          >
            <Image
              source={require("../../../assets/icons/add_circle.png")}
              style={Styles.iconImg}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  generateMarkers = markers => {
    return markers.map((value, index) => {
      return (
        <MapView.Marker
          coordinate={{
            latitude: value.location.latitude,
            longitude: value.location.longitude
          }}
          flat={true}
          title={value.name}
          style={{ width: 60, height: 60 }}
          key={Math.random().toString()}
        >
          <View
            style={{
              width: 60,
              height: 60,
              // backgroundColor: Colors.primaryLight,
              // borderColor: Colors.primaryLight,
              // borderRadius: 1000,
              // borderWidth: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={require("../../../assets/images/marker.png")}
              style={{ width: 50, height: 50 }}
              // resizeMode="contain"
            />
            <View style={{ position: "absolute", top: 10 }}>
              <Image
                source={{ uri: value.photo }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 1000
                }}
              />
            </View>
          </View>
        </MapView.Marker>
      );
    });
  };

  renderCircleDropDown = circles => {
    const { selectedCircle } = this.state;
    return (
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={Styles.dropDown}
          placeholder="Select your Circle"
          placeholderStyle={{ color: Colors.dark }}
          placeholderIconColor={Colors.dark}
          selectedValue={selectedCircle}
          onValueChange={this.onCircleChange}
        >
          <Picker.Item label="Selecr your circle" value="" />
          {circles.map((circle, index) => (
            <Picker.Item label={circle.name} value={circle.code} key={index} />
          ))}
        </Picker>
      </Item>
    );
  };
  render() {
    const { isload } = this.state;
    return (
      <View style={Styles.container}>
        {isload ? (
          <View
            style={[
              Styles.container,
              { justifyContent: "center", alignItems: "center" }
            ]}
          >
            <ActivityIndicator color={Colors.primaryLight} size="large" />
          </View>
        ) : (
          this.renderMap()
        )}
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
)(componentName);
