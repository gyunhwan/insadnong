import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {registerPlaybackService} from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';

const Header = (props) => {
  const navigation = props.navigation;
  const title = props.title;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 70,
              width: Dimensions.get('window').width,
            }}>
            <Image
              source={require('../../assets/images/top_ic_history_w.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                marginRight: 10,
                marginLeft: 20,
              }}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Header;
