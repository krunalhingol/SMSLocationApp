import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SendDirectSms} from 'react-native-send-direct-sms';

import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

export default function App() {
  const [mobileNumber, setMobileNumber] = React.useState('+91-9866395959');
  const [location, setLocation] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const sendSmsData = (mNumber, bodySMS) => {
    SendDirectSms(mNumber, bodySMS)
      .then(res => console.log('then', res))
      .catch(err => console.log('catch', err));
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            setLoading(false);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLoading(false);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  const getAndSendSMS = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            sendSmsData(
              mobileNumber,
              `Location: latitude => ${position.coords.latitude}, longitude => ${position.coords.longitude}`,
            );
            setLoading(false);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLoading(false);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  if (loading) {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1, justifyContent: 'center', backgroundColor: '#c0c9bd'}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*<Text>Result: {result}</Text>*/}
      {/* <Text style={styles.titleTextsmall}>
        Enter Recipients Number
      </Text>
      <TextInput
        value={mobileNumber}
        onChangeText={
          (mobileNumber) => setMobileNumber(mobileNumber)
        }
        placeholder={'Enter Mobile Number'}
        keyboardType='numeric'
        style={styles.textInput}
      />
      <Text style={styles.titleTextsmall}>
        Enter SMS Body
      </Text>
      <TextInput
        value={bodySMS}
        onChangeText={(bodySMS) => setBodySMS(bodySMS)}
        placeholder={'Enter SMS body'}
        style={styles.textInput}
      /> */}
      {/* <TouchableOpacity
        onPress={() =>
          sendSmsData(
            mobileNumber,
            `Location: latitude => ${location.coords.latitude}, longitude => ${location.coords.longitude}`,
          )
        }> */}
      <TouchableOpacity
        onPress={() =>
          sendSmsData(
            mobileNumber,
            `Location: latitude => ${location.coords.latitude}, longitude => ${location.coords.longitude}`,
          )
        }>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 200,
            height: 200,
            borderRadius: 200,
            borderWidth: 3,
            borderColor: 'black',
            borderStyle: 'solid',
            backgroundColor: 'red',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20, textAlign: 'center', color: 'black'}}>
            SOS
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#c0c9bd',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  sendButtonLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  // sendButton: {
  //   width: '100%',
  //   backgroundColor: '#22C674',
  //   borderRadius: 4,
  //   opacity: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingVertical: 10,
  //   marginTop: 30,
  // },
  titleTextsmall: {
    marginBottom: 8,
    marginTop: 16,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  textInput: {
    paddingLeft: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3F44511F',
    borderRadius: 4,
    height: 44,
    color: '#000000',
    opacity: 0.75,
    width: '100%',
  },
});
