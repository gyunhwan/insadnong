import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import topImg from '../assets/images/top_img.png';
import {Toast} from 'native-base';

import {UserContextProvider as UserProvider} from './Common/UserContexetProvider';
const MainScreen = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const navigation = props.navigation;

  return (
    <UserProvider>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/main_img.png')}
          resizeMode="contain"
          style={styles.mainImg}
        />
        <AutoHeightImage
          source={topImg}
          width={Dimensions.get('window').width}
          style={{zIndex: 5}}
        />

        <View style={styles.mainYellowBox}>
          <AutoHeightImage
            source={require('../assets/images/main_text.png')}
            width={Dimensions.get('window').width - 100}
            style={{alignSelf: 'center'}}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('IntroScreen')}
          activeOpacity={1}
          style={styles.mainBtn}>
          <Text style={styles.mainBottomTxt}>START</Text>
        </TouchableOpacity>
      </View>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    backgroundColor: '#000',
    zIndex: 1,
  },
  mainImg: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 50,
    zIndex: -1,
  },
  mainYellowBox: {
    width: Dimensions.get('window').width,
    height: 150,
    backgroundColor: '#FFCF03',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
  },
  mainBtn: {
    backgroundColor: '#000000',
    width: Dimensions.get('window').width - 180,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 125,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 10,
  },
  mainBottomTxt: {
    paddingVertical: 12,
    color: '#fff',
    alignSelf: 'center',
    fontSize: 18,
  },
});

export default MainScreen;
