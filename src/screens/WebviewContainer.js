import React from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const WebviewContainer = ({handleSetRef, handleEndLoading}) => {
  const url = 'https://dmonster1472.cafe24.com/map/';

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = ({nativeEvent: {data}}) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log('data에 웹뷰에서 보낸 값이 들어옵니다.', data);
  };

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={handleSetRef}
      source={{uri: url}}
    />
  );
};

export default WebviewContainer;
