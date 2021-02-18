import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const prevTrack = ({prevTrack}) => {
  return (
    <View>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.5}
        onPress={prevTrack}>
        <Image
          source={require('../../assets/images/ic_reverse.png')}
          style={styles.playIcons}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playIcons: {
    width: 20,
    height: 20,
  },
});

export default prevTrack;
