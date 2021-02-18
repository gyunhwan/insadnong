import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const nextTrack = ({nextTrack}) => {
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
        onPress={nextTrack}>
        <Image
          source={require('../../assets/images/ic_forwar.png')}
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

export default nextTrack;
