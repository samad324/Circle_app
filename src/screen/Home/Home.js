import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import MapView, { Callout } from "react-native-maps";
import { Button, Icon, Item, Picker, Thumbnail } from "native-base";
import { Location, TaskManager } from "expo";

import { Colors } from "../../constants/index";
import { Styles } from "./Styles";
import {
  getLocationAsync,
  showToast,
  sendNotification
} from "../../config/helpers";
import firebase, {
  searchInDB,
  updateCircleLocationsInDB
} from "../../config/firebase";
import { store } from "../../store/store";
import moment from "moment";

const LOCATION_TASK = "background-location";

TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {
  if (error) {
    showToast(e.message, "danger");
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations);
    watchLocation(locations);
  }
});

const watchLocation = async locations => {
  const { user } = await store.getState().authReducer;

  const location = locations[0].coords;
  try {
    user.circles.map(async ({ code }) => {
      const data = {
        location,
        timeStamp: locations[0].timestamp,
        uid: user.uid,
        pushToken: user.pushToken
      };

      await updateCircleLocationsInDB(code, data);
    });
  } catch (e) {
    showToast(e.message, "danger");
  }
};

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
                : showToast("You are not an admin! ", "warning")
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
    // BackgroundFetch.setMinimumIntervalAsync(15);
    // BackgroundFetch.registerTaskAsync("UPDATE_LOCATION");

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
      showToast("Something went wrong!", "danger");
    }
  };

  watchLocation = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      distanceInterval: 10
    });

    const { user } = this.props;

    const location = await getLocationAsync();
    try {
      this.interval = setInterval(() => {
        user.circles.map(async ({ code }) => {
          const data = {
            location,
            timeStamp: Date.now(),
            uid: user.uid,
            pushToken: user.pushToken
          };
          await updateCircleLocationsInDB(code, data);
        });
      }, 60000);
    } catch (e) {
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

  sendAlert = async () => {
    const { selectedCircle, markers } = this.state;
    const { user } = this.props;
    if (!selectedCircle) {
      return showToast("Please select one for your circles!", "danger");
    }
    this.setState({ isload: true });
    const tokens = markers.map(marker => {
      const data = {
        to: marker.pushToken,
        title: "Danger Alert",
        body: `${user.name} is in danger, please react out to him/her...`
      };
      if (user.pushToken !== marker.push) {
        return data;
      }
    });
    try {
      await sendNotification(tokens);
      this.setState({ isload: false });
      showToast("Everyone was notified!", "success");
    } catch (error) {
      console.log(error);
      this.setState({ isload: false });
      showToast("Something went wrong!", "danger");
    }
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
          <View>
            <TouchableOpacity style={Styles.btnDanger} onPress={this.sendAlert}>
              <Image
                source={require("../../../assets/icons/danger.png")}
                style={Styles.iconImg}
              />
            </TouchableOpacity>
          </View>
          <View>
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
      </View>
    );
  };

  generateMarkers = markers => {
    const { user } = this.props;
    return markers.map((value, index) => {
      if (value.uid == user.uid) return;
      return (
        <MapView.Marker
          coordinate={{
            latitude: value.location.latitude,
            longitude: value.location.longitude
          }}
          key={Math.random().toString()}
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
          <Callout>
            <View
              style={{
                width: 240,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              {/* <View style={{ width: 60, height: 60 }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 1000,
                    borderWidth: 2,
                    borderColor: Colors.primaryLight
                  }}
                  source={{ uri: value.photo }}
                />
              </View> */}
              <View>
                <Text>name: {value.name}</Text>
                <Text>Last Update: {moment(value.timeStamp).fromNow()}</Text>
              </View>
            </View>
          </Callout>
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
