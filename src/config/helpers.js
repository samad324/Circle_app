import { Location, Permissions, Notifications } from "expo";
// import geolib from "geolib";
import { Toast } from "native-base";

// const checkDistance = async (start, end) => {
//   const inCircule = await geolib.isPointInCircle(start, end, 1000);
//   console.log(inCircule);
//   return inCircule;
// };

export const getLocationAsync = async () => {
  try {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      alert("Ah! we can't access your location!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    });

    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    return coords;
  } catch (e) {
    console.log("e =>", e);
    throw e;
  }
};

export const measureDistance = async (services, currentLocation) => {
  const arr = [];
  for (let i = 0; i < services.length; i++) {
    const distance = await checkDistance(currentLocation, services[i].location);
    console.log("distance =>", distance);

    if (distance) {
      arr.push({ ...services[i].location, title: services[i].title });
    }
  }

  return arr;
};

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  let token = await Notifications.getExpoPushTokenAsync();

  return token;
};

export const sendNotification = token => {
  return new Promise((resolve, reject) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate"
      },
      body: JSON.stringify(token)
    })
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

export const showToast = (messge, type) => {
  Toast.show({
    text: messge,
    type,
    buttonText: "Okay",
    duration: 3000
  });
};

export const sendSms = (name, code, number) => {
  return new Promise((resolve, reject) => {
    fetch("https://circlesms324.herokuapp.com/sms", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject: `you are invited by ${name} to join a circle. Please enter ${code} in circle app to join.`,
        to: `+92${number}`
      })
    })
      .then(res => resolve())
      .catch(err => reject(err));
  });
};
