import * as React from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import Slider from '@react-native-community/slider';
import BottomSheet from 'reanimated-bottom-sheet';
import axios from 'axios';
import qs from 'qs';

import TrackPlayer, {
  TrackPlayerEvents,
  STATE_PLAYING,
  useTrackPlayerProgress,
} from 'react-native-track-player';

import {useTrackPlayerEvents} from 'react-native-track-player/lib/hooks';

import Header from './Common/Header';
import NextTrack from './Common/nextTrack';
import PrevTrack from './Common/prevTrack';

const baseURL = 'http://dmonster1472.cafe24.com/';

const F_HEIGHT = Dimensions.get('window').height - 70;

const Detail = (props) => {
  const title = props.route.params.title;
  const content = props.route.params.content;
  const [subId, setSubId] = React.useState(props.route.params.subId);

  const background = props.route.params.background;
  const navigation = props.navigation;
  const items = props.route.params.items;

  const [list, setList] = React.useState([]);
  const [music, setMusic] = React.useState([]);

  const [tList, setTlist] = React.useState([]);
  const [artwork, setArtwork] = React.useState('');
  const [album, setAlbum] = React.useState('');
  const [subList, setSubList] = React.useState([]);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [isSeeking, setIsSeeking] = React.useState(false);
  const {position, duration, bufferedPosition} = useTrackPlayerProgress(250);

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
    if (event.state === STATE_PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  const getAllList = () => {
    axios({
      method: 'post',
      url: `${baseURL}/json/proc_json.php?method=proc_get_insadong_category`,
      data: qs.stringify({
        ca_name: items.category,
      }),
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          const data = res.data.arrItems.map((item) => {
            switch (item.url) {
              case 'Beyond':
                item.url = require('../audios/Beyond.mp3');
                break;
              case 'Cheel':
                item.url = require('../audios/Cheel.mp3');
                break;
              case 'CrowdTalking':
                item.url = require('../audios/CrowdTalking.mp3');
                break;
              case 'DaytimeForrestBonfire':
                item.url = require('../audios/DaytimeForrestBonfire.mp3');
                break;
              case 'Hologram':
                item.url = require('../audios/Hologram.mp3');
                break;
              case 'June':
                item.url = require('../audios/June.mp3');
                break;
              case 'MotorAircraftApproaching':
                item.url = require('../audios/MotorAircraftApproaching.mp3');
                break;
              case 'MourningDove':
                item.url = require('../audios/MourningDove.mp3');
                break;
              case 'music':
                item.url = require('../audios/music.mp3');
                break;
              case 'SunnyTravel':
                item.url = require('../audios/SunnyTravel.mp3');
                break;
              case 'Tak':
                item.url = require('../audios/Tak.mp3');
                break;
              case 'TeaTime':
                item.url = require('../audios/TeaTime.mp3');
                break;
              case 'Traversing':
                item.url = require('../audios/Traversing.mp3');
                break;
              case 'WalkingintheSky':
                item.url = require('../audios/WalkingintheSky.mp3');
                break;
              case 'Walkingthroughwoods':
                item.url = require('../audios/Walkingthroughwoods.mp3');
                break;
              default:
                return false;
            }

            return item;
          });

          setTlist(data);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const getList = () => {
    axios({
      method: 'get',
      url: `${baseURL}/json/proc_json.php?method=proc_insadong_view`,
      data: qs.stringify({
        wr_id: subId,
      }),
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          setList(res.data.arrItems);
          setSubList(res.data.arrItems[0].list);
        }
      })
      .catch((e) => console.log(e));
  };

  const trackPlayerInit = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(tList);
      await TrackPlayer.skip(subId);

      let trackObject = await TrackPlayer.getTrack(subId);

      setSubList(trackObject.list);

      return true;
    } catch (err) {
      console.log(err.message);
    }
  };

  React.useEffect(() => {
    getAllList();

    return () => {
      getAllList();
    };
  }, []);

  React.useEffect(() => {
    getList();
    trackPlayerInit();

    const startPlayer = async () => {
      try {
        let isInit = await trackPlayerInit();
        setIsTrackPlayerInit(isInit);
      } catch (err) {
        console.log(err.message);
      }
    };
    startPlayer();

    return () => {
      getList();
      trackPlayerInit();
    };
  }, [tList]);

  //this hook updates the value of the slider whenever the current position of the song changes
  React.useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration]);

  //start playing the TrackPlayer when the button is pressed
  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };
  //this function is called when the user starts to slide the seekbar
  const slidingStarted = async () => {
    setIsSeeking(true);
  };
  //this function is called when the user stops sliding the seekbar
  const slidingCompleted = async (value) => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const rePlay = async () => {
    await TrackPlayer.stop();
    setSliderValue(0);
    await TrackPlayer.play();
  };

  const prevTrack = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const getCur = await TrackPlayer.getCurrentTrack();
      const info = await TrackPlayer.getTrack(getCur);

      setSubId(info.id);
      setArtwork(info.photo);
      setAlbum(info.title);
      setSubList(info.list);
    } catch (err) {
      Alert.alert('이전 리스트가 없습니다.', '다음 리스트를 눌러주세요.', [
        {
          text: '확인',
        },
      ]);
    }
  };

  const nextTrack = async () => {
    try {
      await TrackPlayer.skipToNext();
      const getCur = await TrackPlayer.getCurrentTrack();
      const info = await TrackPlayer.getTrack(getCur);
      setSubId(info.id);
      setArtwork(info.photo);
      setAlbum(info.title);
      setSubList(info.list);
    } catch (err) {
      Alert.alert('다음 리스트가 없습니다.', '이전 리스트를 눌러주세요.', [
        {
          text: '확인',
        },
      ]);
    }
  };

  const renderContent = () => (
    <View
      style={{
        backgroundColor: '#FFCF03',
        paddingVertical: 16,
        height: F_HEIGHT,
      }}>
      <View style={styles.topBar} />
      <Text style={styles.title}>{!album ? title : album}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {subList
          ? subList.map((list, idx) => (
              <View key={idx}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: Dimensions.get('window').width - 40,
                    alignSelf: 'center',
                    marginLeft: idx === 0 ? 20 : 0,
                    marginRight: idx === subList.length - 1 ? 20 : 0,
                  }}>
                  <View
                    style={{
                      paddingBottom: 150,
                    }}>
                    {list.photo.length > 0 ? (
                      <Image
                        source={{uri: `${list.photo}`}}
                        resizeMode="cover"
                        style={{
                          width: Dimensions.get('window').width - 50,
                          height: Dimensions.get('window').width - 140,
                          borderRadius: 15,
                          marginBottom: 20,
                          alignSelf: 'center',
                        }}
                      />
                    ) : null}
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        paddingHorizontal: 14,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      {list.content}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{position: 'relative'}}>
      <Header title={title} navigation={navigation} style={{zIndex: 10}} />

      <View style={styles.container}>
        <ImageBackground
          source={{uri: `${!artwork ? background : artwork}`}}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            zIndex: -1,
            marginTop: -150,
          }}
          resizeMode="cover">
          <BottomSheet
            // ref={sheetRef}
            snapPoints={[240, F_HEIGHT, 240]}
            borderRadius={20}
            renderContent={renderContent}
            enabledContentGestureInteraction={true}
            enabledContentTapInteraction={true}
          />
        </ImageBackground>
        <View style={styles.play_area}>
          <View style={styles.slider_wrap}>
            <Text style={styles.slider_time}>
              {moment
                .duration(position, 'seconds')
                .format('h:mm:ss', {forceLength: true, stopTrim: 'm'})}
            </Text>

            <Slider
              style={styles.slider_style}
              minimumValue={0}
              maximumValue={1}
              value={sliderValue}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#CE9908"
              onSlidingStart={slidingStarted}
              onSlidingComplete={slidingCompleted}
              thumbTintColor="#fff"
            />
            <Text style={styles.slider_time}>
              {moment
                .duration(duration, 'seconds')
                .format('h:mm:ss', {forceLength: true, stopTrim: 'm'})}
            </Text>
          </View>
          <View style={styles.play_wrap}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => rePlay()}>
              <Image
                source={require('../assets/images/ic_re.png')}
                style={styles.playIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <PrevTrack prevTrack={prevTrack} />
            <TouchableOpacity
              style={styles.playBtn}
              onPress={onButtonPressed}
              activeOpacity={1}>
              <Image
                source={
                  isPlaying
                    ? require('../assets/images/ic_stop.png')
                    : require('../assets/images/ic_play.png')
                }
                style={{width: 20, height: 20, marginLeft: isPlaying ? 0 : 4}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <NextTrack nextTrack={nextTrack} />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/images/ic_menu.png')}
                style={styles.playIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  progressBar: {
    height: 20,
    paddingBottom: 90,
  },
  controlsContainer: {
    flex: 0.45,
    justifyContent: 'flex-start',
  },
  mainYellowBox: {
    width: Dimensions.get('window').width,
    height: 320,
    backgroundColor: '#FFCF03',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  topBar: {
    width: 45,
    height: 4,
    backgroundColor: '#202227',
    borderRadius: 50,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  play_area: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFCF03',
    zIndex: 10,
    elevation: 0,
    width: Dimensions.get('window').width,
    height: 180,
  },
  slider_wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  slider_time: {
    fontSize: 15,
  },
  slider_style: {
    height: '70%',
    width: '60%',
  },
  play_wrap: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  playIcons: {
    width: 20,
    height: 20,
  },
});

export default Detail;
