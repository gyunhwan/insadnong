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
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import Slider from '@react-native-community/slider';

// import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import TrackPlayer, {
  TrackPlayerEvents,
  STATE_PLAYING,
  useTrackPlayerProgress,
} from 'react-native-track-player';
//import the hook provided by react-native-track-player to manage the progress
import {useTrackPlayerEvents} from 'react-native-track-player/lib/hooks';
import axios from 'axios';
import Header from './Common/Header';
//import statement for slider
// import Slider from '@react-native-community/slider';

const baseURL = 'http://dmonster1472.cafe24.com/';

const F_HEIGHT = Dimensions.get('window').height - 70;

const Detail = (props) => {
  // const navigation = props.navigation;
  const title = props.route.params.title;
  const content = props.route.params.content;
  const subId = props.route.params.subId;
  const background = props.route.params.background;
  const navigation = props.navigation;

  const [list, setList] = React.useState([]);
  const [music, setMusic] = React.useState([]);

  const getMusic = () => {
    //http://dmonster1472.cafe24.com/json/proc_json.php?method=proc_insadong_view&wr_id=16
    axios({
      method: 'get',
      url: `${baseURL}/json/proc_json.php?method=proc_insadong_view&wr_id=${subId}`,
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          setMusic(res.data.arrItems[0].wr_link);
        }
        console.log('getMusic :: ', res);
      })
      // .then((res) => console.log('인사동 data :: ', res.data))
      .catch((e) => console.log(e));
  };

  const getList = () => {
    axios({
      method: 'get',
      url: `${baseURL}/json/proc_json.php?method=proc_insadong_view2&wr_1=${subId}`,
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
    return () => {
      getList();
    };
  }, []);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  //the value of the slider should be between 0 and 1
  const [sliderValue, setSliderValue] = React.useState(0);

  //flag to check whether the use is sliding the seekbar or not
  const [isSeeking, setIsSeeking] = React.useState(false);

  //useTrackPlayerProgress is a hook which provides the current position and duration of the track player.
  //These values will update every 250ms
  const {position, duration, bufferedPosition} = useTrackPlayerProgress(250);

  // console.log('music :: ', music);
  // const audio = require('../audios/music.mp3');
  const path = '../audios/';
  const pathAll = `'${path}${music}'`;
  // console.log('pathAll : ', pathAll);
  // const audio = require(pathAll);
  const audio = require('../audios/music.mp3');

  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      id: '1',
      // url:
      //   'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
      // url: require(pathAll),
      url: audio,
      type: 'default',
      title: 'My Title',
      album: 'My Album',
      artist: 'Rohan Bhatia',
      artwork: 'https://picsum.photos/100',
    });
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_JUMP_FORWARD,
        TrackPlayer.CAPABILITY_JUMP_BACKWARD,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
    });
    return true;
  };

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
    if (event.state === STATE_PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });
  useTrackPlayerEvents([TrackPlayerEvents.CAPABILITY_SEEK_TO], (event) => {
    if (event.state === STATE_PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  // console.log('Detail id :: ', subId);
  // console.log('Detail에 담긴 리스트 :: ', list);

  //initialize the TrackPlayer when the App component is mounted
  // const startPlayer = async () => {
  //   let isInit = await trackPlayerInit();
  //   setIsTrackPlayerInit(isInit);
  // };

  React.useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };
    startPlayer();
  }, []);

  //this hook updates the value of the slider whenever the current position of the song changes
  React.useEffect(() => {
    console.log('position :: ', position);
    console.log('duration :: ', duration);

    if (!isSeeking && position && duration) {
      setSliderValue(position);
    }
    return () => setSliderValue();
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
    await TrackPlayer.stop();
    setSliderValue(value);
    // await TrackPlayer.seekTo(value);
    // let val = parseInt(value);
    let val01 = value.toFixed(3);
    let val = parseFloat(val01);
    console.log('type of', typeof val);
    console.log('vavavavava', val);
    // await TrackPlayer.play();
    await TrackPlayer.seekTo(val);

    // setSliderValue(value);
    setIsSeeking(false);
  };

  const rePlay = async () => {
    await TrackPlayer.stop();
    setSliderValue(0);
    await TrackPlayer.play();
    // TrackPlayer.play();
  };

  const jumpBackward = async () => {
    let newPosition = await TrackPlayer.getPosition();
    newPosition -= 10;
    if (newPosition < 0) {
      newPosition = 0;
    }
    TrackPlayer.seekTo(newPosition);
  };

  const jumpForward = async () => {
    let newPosition = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    newPosition += 10;
    if (newPosition > duration) {
      newPosition = duration;
    }
    TrackPlayer.seekTo(newPosition);
  };

  const sheetRef = React.useRef(null);

  const renderContent = () => (
    <View
      style={{
        backgroundColor: '#FFCF03',
        paddingVertical: 16,
        height: F_HEIGHT,
      }}>
      <View style={styles.topBar} />
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{paddingHorizontal: 2, marginLeft: 20}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              width: Dimensions.get('window').width - 40,
              alignSelf: 'center',
            }}>
            <View style={{paddingBottom: 200}}>
              <Image
                source={{uri: `${background}`}}
                resizeMode="cover"
                style={{
                  width: Dimensions.get('window').width - 50,
                  height: Dimensions.get('window').width - 140,
                  borderRadius: 15,
                  marginBottom: 20,
                  alignSelf: 'center',
                  paddingHorizontal: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  paddingHorizontal: 14,
                  alignSelf: 'center',
                }}>
                {content}
              </Text>
            </View>
          </ScrollView>
        </View>
        {list
          ? list.map((l, idx) => (
              <View key={idx}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: Dimensions.get('window').width - 40,
                    alignSelf: 'center',
                    marginRight: idx === list.length - 1 ? 20 : 0,
                  }}>
                  <View
                    style={{
                      paddingBottom: 100,
                    }}>
                    <Image
                      source={{uri: `${l.pic[0]}`}}
                      resizeMode="cover"
                      style={{
                        width: Dimensions.get('window').width - 50,
                        height: Dimensions.get('window').width - 140,
                        borderRadius: 15,
                        marginBottom: 20,
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        paddingHorizontal: 14,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      {l.content}
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

      {/* <View>
        <Text>
          Track progress: {position} seconds out of {duration} total
        </Text>
        <Text>
          Buffered progress: {bufferedPosition} seconds buffered out of{' '}
          {duration} total
        </Text>
      </View> */}

      <View style={styles.container}>
        <ImageBackground
          source={{uri: `${background}`}}
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
                .duration(sliderValue, 'seconds')
                .format('h:mm:ss', {forceLength: true, stopTrim: 'm'})}
            </Text>

            <Slider
              style={styles.slider_style}
              minimumValue={0}
              maximumValue={bufferedPosition}
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
            <TouchableOpacity activeOpacity={0.5} onPress={() => rePlay()}>
              <Image
                source={require('../assets/images/ic_re.png')}
                style={styles.playIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={jumpBackward}>
              <Image
                source={require('../assets/images/ic_reverse.png')}
                style={styles.playIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.5} onPress={jumpForward}>
              <Image
                source={require('../assets/images/ic_forwar.png')}
                style={styles.playIcons}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  topBar: {
    width: 50,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 10,
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
