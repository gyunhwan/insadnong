import * as React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import axios from 'axios';

// const list = [
//   {
//     id: 1,
//     title: '인사동의 유래',
//     description:
//       '인사동은 도심 속에서 낡지만 귀중한 전통의 물건들이 교류되는 소중한 공간이다. 인사동에는 큰 대로를 중심으로...',
//     background: {
//       original: '../landscape/img01.jpg',
//       src: require('../landscape/img01.jpg'),
//     },
//     audio: require('../audios/audio_test.mp3'),
//     playTime: '20:00',
//   },
//   {
//     id: 2,
//     title: '골동품 거리의 탄생',
//     description:
//       '인사동은 도심 속에서 낡지만 귀중한 전통의 물건들이 교류되는 소중한 공간이다. 인사동에는 큰 대로를 중심으로...',
//     background: {
//       original: '../landscape/img02.jpg',
//       src: require('../landscape/img02.jpg'),
//     },
//     audio: require('../audios/audio_test.mp3'),
//     playTime: '20:00',
//   },
//   {
//     id: 3,
//     title: '밀려드는 신문물',
//     description:
//       '인사동은 도심 속에서 낡지만 귀중한 전통의 물건들이 교류되는 소중한 공간이다. 인사동에는 큰 대로를 중심으로...',
//     background: {
//       original: '../landscape/img03.jpg',
//       src: require('../landscape/img03.jpg'),
//     },
//     audio: require('../audios/audio_test.mp3'),
//     playTime: '20:00',
//   },
//   {
//     id: 3,
//     title: '밀려드는 신문물',
//     description:
//       '인사동은 도심 속에서 낡지만 귀중한 전통의 물건들이 교류되는 소중한 공간이다. 인사동에는 큰 대로를 중심으로...',
//     background: {
//       original: '../landscape/img03.jpg',
//       src: require('../landscape/img03.jpg'),
//     },
//     audio: require('../audios/audio_test.mp3'),
//     playTime: '20:00',
//   },
//   {
//     id: 3,
//     title: '밀려드는 신문물',
//     description:
//       '인사동은 도심 속에서 낡지만 귀중한 전통의 물건들이 교류되는 소중한 공간이다. 인사동에는 큰 대로를 중심으로...',
//     background: {
//       original: '../landscape/img03.jpg',
//       src: require('../landscape/img03.jpg'),
//     },
//     audio: require('../audios/audio_test.mp3'),
//     playTime: '20:00',
//   },
// ];

const F_HEIGHT = Dimensions.get('window').height;

const baseURL = 'http://dmonster1472.cafe24.com/';

const NorthList = (props) => {
  const navigation = props.navigation;

  const sheetRef = React.useRef(null);

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

  console.log('list :: ', list);

  const RenderRow = ({item, idx}) => {
    return (
      <>
        {item.category === '북' ? (
          <TouchableOpacity
            key={item.wr_id}
            style={styles.listWrap}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Detail', {
                title: item.subject,
                background: item.pic[0],
                // backgroundSrc: item.background.src,
                // audio: item.audio,
              })
            }>
            <View style={styles.listTextWrap}>
              <Text style={styles.listTitle}>{item.subject}</Text>
              <Text
                style={[styles.listDesc, {lineHeight: 22}]}
                numberOfLines={4}>
                {item.content}
              </Text>
              {/* <Text style={styles.playTime}>{`재생시간 ${item.playTime}`}</Text> */}
            </View>
            <View style={styles.listMedia}>
              <ImageBackground
                source={{uri: `${item.pic[0]}`}}
                resizeMode="cover"
                borderBottomRightRadius={20}
                borderTopLeftRadius={20}
                style={{
                  width: 120,
                  height: 180,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Image
                  source={require('../assets/images/ic_sound.png')}
                  resizeMode="contain"
                  style={{width: 50, height: 50, margin: 5}}
                />
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: F_HEIGHT,
      }}>
      <FlatList
        data={list}
        renderItem={RenderRow}
        keyExtractor={(list, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={styles.listWrapBox}
        navigation={navigation}
      />
    </View>
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'papayawhip',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/images/map.png')}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
        />

        <Button
          title="Open Bottom Sheet"
          onPress={() => sheetRef.current.snapTo(0)}
        />
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[500, F_HEIGHT, 500]}
        borderRadius={20}
        renderContent={renderContent}
      />
    </>
    // <View style={styles.container}>
    //   <Image
    //     source={require('../assets/images/map.png')}
    //     style={{
    //       width: Dimensions.get('window').width,
    //       height: Dimensions.get('window').height - 500,
    //     }}
    //   />

    //   <FlatList
    //     data={list}
    //     renderItem={RenderRow}
    //     keyExtractor={(list, index) => index.toString()}
    //     showsVerticalScrollIndicator={false}
    //     scrollEnabled={true}
    //     nestedScrollEnabled={true}
    //     style={styles.listWrapBox}
    //     navigation={navigation}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listWrapBox: {
    backgroundColor: '#fff',
    zIndex: 5,
    elevation: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 200,
  },
  listWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 25,
  },
  listTextWrap: {
    flex: 2,
    marginRight: 20,
  },
  listMedia: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listDesc: {
    fontSize: 16,
    marginBottom: 15,
    color: '#888888',
  },
  playTime: {
    fontSize: 14,
    color: '#888888',
  },
});

export default NorthList;
