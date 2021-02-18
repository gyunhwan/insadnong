import * as React from 'react';
import {View, Text} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Map = () => {
  const [locationLoad, setLocationLoad] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    Geolocation.getCurrentPosition(
      (location) => {
        let userGeo = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        //           userGeo 에 담는 lat, lng 값 useState 변수에 담아서 webview 에 넣어주시면 될 것 같습니다
        setLocationLoad(true);

        //return true;
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 100000},
    );
  }, [locationLoad]);

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Map;
