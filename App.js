import * as React from 'react';
import {
  StatusBar,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from 'react-native-splash-screen';
import {Root, Toast} from 'native-base';
import messaging from '@react-native-firebase/messaging';
import Modal from 'react-native-modal';
import axios from 'axios';
import qs from 'qs';
import Router from './src/route/Router';
const Stack = createStackNavigator();

// firebase iOS 인증
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission({
    sound: false,
    announcement: true,
    alert: true,
    badge: true,
    carPlay: true,
    provisional: false,
  });
  3;

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

const baseURL = 'http://dmonster1472.cafe24.com/';

const App = () => {
  const fcmTokenSend = (fcmToken) => {
    console.log('fcmToken :: ', fcmToken);
    axios({
      method: 'post',
      url: `${baseURL}/json/proc_json.php?method=proc_notice_push`,
      data: qs.stringify({
        token: fcmToken,
      }),
    })
      .then((res) => console.log(res.data.resultItem.message))
      .catch((err) => Alert.alert(err.message));
  };

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  React.useEffect(() => {
    messaging()
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          fcmTokenSend(currentToken);
        } else {
          // Show permission request.
          console.log(
            'No registration token available. Request permission to generate one.',
          );
          // Show permission UI.
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }, []);

  const [nTitle, setNtitle] = React.useState('');
  const [nBody, setNbody] = React.useState('');
  const [isModalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    messaging().onMessage((remoteMessage) => {
      console.log(remoteMessage);
      setNtitle(remoteMessage.notification.title);
      setNbody(remoteMessage.notification.body);
      setModalVisible(true);
    });
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View>
        <Modal isVisible={isModalVisible} style={{marginVertical: '50%'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#FFCF03',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  paddingVertical: 20,
                  color: '#252525',
                  textAlign: 'center',
                }}>
                [공지] {nTitle}
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag">
              <View
                style={{
                  marginVertical: 40,
                }}>
                <Text
                  style={{fontSize: 18, lineHeight: 28, textAlign: 'center'}}>
                  {nBody}
                </Text>
              </View>
            </ScrollView>
            <View
              style={{
                alignSelf: 'flex-end',
                width: '100%',
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: '#eee',
              }}>
              <TouchableOpacity onPress={toggleModal}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    paddingVertical: 15,
                  }}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <Root>
        <Router></Router>
      </Root>
    </>
  );
};

export default App;
