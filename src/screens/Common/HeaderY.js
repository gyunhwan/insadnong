import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {registerPlaybackService} from 'react-native-track-player';

const HeaderY = (props) => {
  const navigation = props.navigation;
  const title = props.title;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#FFCF03',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('window').width,
          height: 70,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 0}}>
          <Image
            source={require('../../assets/images/top_ic_history.png')}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              marginRight: 10,
              marginLeft: 20,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#000',
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default HeaderY;
