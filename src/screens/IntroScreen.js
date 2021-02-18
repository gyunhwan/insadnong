import * as React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import axios from 'axios';
import topImg from '../assets/images/top_img.png';
const baseURL = 'http://dmonster1472.cafe24.com/';

const IntroScreen = (props) => {
  const navigation = props.navigation;

  const [list, setList] = React.useState([]);

  const getList = () => {
    axios({
      method: 'get',
      url: `${baseURL}/json/proc_json.php?method=proc_get_insadong`,
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          setList(res.data.arrItems);
        }
      })
      // .then((res) => console.log('인사동 data :: ', res.data))
      .catch((e) => console.log(e));
  };

  React.useEffect(() => {
    getList();
  }, []);

  return (
    <View style={{flex: 1}}>
      <AutoHeightImage
        source={topImg}
        width={Dimensions.get('window').width}
        height={(Dimensions.get('window').height / 100) * 20}
        style={{zIndex: 5, alignSelf: 'flex-start'}}
      />
      <View style={{position: 'relative'}}>
        <ImageBackground
          source={require('../assets/images/map_road.png')}
          style={{
            width: Dimensions.get('window').width,
            height: (Dimensions.get('window').height / 100) * 74,
            marginTop: 0,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '북',
                title: '북인사 마당',
              })
            }
            style={{
              position: 'absolute',
              top: Dimensions.get('window').height / 100,
              left: (Dimensions.get('window').width / 100) * 15,
              zIndex: 5,
            }}>
            <AutoHeightImage
              source={require('../assets/images/map_info04.png')}
              width={(Dimensions.get('window').height / 100) * 20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '서',
                title: '공평도시유적전시관',
              })
            }
            style={{
              position: 'absolute',
              top: (Dimensions.get('window').height / 100) * 35,
              left: Dimensions.get('window').width / 100,
              zIndex: 5,
            }}>
            <AutoHeightImage
              source={require('../assets/images/map_info02.png')}
              width={(Dimensions.get('window').height / 100) * 20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '동',
                title: '낙원악기 상가',
              })
            }
            style={{
              position: 'absolute',
              top: (Dimensions.get('window').height / 100) * 23,
              left: (Dimensions.get('window').width / 100) * 60,
              zIndex: 5,
            }}>
            <AutoHeightImage
              source={require('../assets/images/map_info01.png')}
              width={(Dimensions.get('window').height / 100) * 20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Depth01', {
                list: list,
                category: '남',
                title: '남인사 마당',
              })
            }
            style={{
              position: 'absolute',
              top: (Dimensions.get('window').height / 100) * 48,
              left: (Dimensions.get('window').width / 100) * 40,
              zIndex: 5,
            }}>
            <AutoHeightImage
              source={require('../assets/images/map_info03.png')}
              width={(Dimensions.get('window').height / 100) * 20}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: (Dimensions.get('window').width / 100) * 100,
          left: (Dimensions.get('window').width / 100) * 40,
          zIndex: 5,
        }}
        onPress={() => navigation.navigate('IapTest')}>
        <Text>초기화아아아아</Text>
      </TouchableOpacity>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#FFCF03',
          width: Dimensions.get('window').width,
          height: (Dimensions.get('window').height / 100) * 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AutoHeightImage
          source={require('../assets/images/map_text.png')}
          width={(Dimensions.get('window').width / 100) * 90}
        />
      </View>
    </View>
  );
};

export default IntroScreen;
