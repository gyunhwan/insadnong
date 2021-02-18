import React from 'react';
import {View, Text, Button, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {TapGestureHandler} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const AnimatedScreen = () => {
  const translateY = new Animated.Value(300);

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffddff',
          justifyContent: 'flex-end',
        }}>
        <Button title="Click me" onPress={() => process.Value(0)} />
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          width: width - 20,
          height: 200,
          backgroundColor: '#fff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          transform: [{translateY: translateY}],
        }}>
        <Text>Animated</Text>
      </Animated.View>
    </>
  );
};

export default AnimatedScreen;
