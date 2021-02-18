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
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
  consumeAllItemsAndroid,
} from 'react-native-iap';
import AutoHeightImage from 'react-native-auto-height-image';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import qs from 'qs';
import Geolocation from 'react-native-geolocation-service';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import HeaderY from './Common/HeaderY';

const baseURL = 'http://dmonster1472.cafe24.com/';

const Depth01 = (props) => {
  const navigation = props.navigation;
  const list = props.route.params.list;
  const title = props.route.params.title;
  const category = props.route.params.category;

  // 인앱 결제 관련 상태
  let purchaseUpdateSubscription;
  let purchaseErrorSubscription;

  const sheetRef = React.useRef(null);

  const [selectList, setSelectList] = React.useState([]);

  const [location, setLocation] = React.useState({});
  const [locationLoad, setLocationLoad] = React.useState(false);
  //물품 리스트
  const [purchase, setPurchase] = React.useState('');
  const [availableItemsMessage, setAvailableItemsMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [receipt, setReceipt] = React.useState('');
  const [productList, setProductList] = React.useState('');
  const [userInfo, setUserInfo] = React.useState('');
  //구매 물품 목록
  const itemSkus = Platform.select({
    ios: [
      'com.cooni.point1000',
      'com.cooni.point5000', // dooboolab
    ],
    android: [
      'south.insadong1',
      // 'point_1000', '5000_point', // dooboolab
    ],
  });
  //component didmout + compopnent will unmount 상태 초기화
  const inappProduct = 'south.insadong1';
  React.useEffect(() => {
    getList();
    setLoading(true);
    setSignIn();
    checkLogin();
    return cwu;
    // requestPermissions();
  }, []);
  const setSignIn = async () => {
    await GoogleSignin.configure({
      webClientId:
        '324854429229-cibnt7najmm42aol2n0p7t520jnii03o.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    });
  };
  // React.useEffect(() => {
  //   getItems();
  //   getAvailablePurchases();
  //   // requestPermissions();
  // }, [loading]);

  const checkLogin = async () => {
    const login = await GoogleSignin.isSignedIn();
    let _userInfo;
    if (login == true) {
      _userInfo = await GoogleSignin.getCurrentUser();
    }
    setUserInfo(_userInfo);
    if (_userInfo != null) {
      await callIap();
      await getItems();
      await setSubscription();
      await getAvailablePurchases();
    }
  };
  const _getPurchase = async () => {
    if (userInfo == null) {
      await _signIn();
    }
    await getAvailablePurchases('purchase');
  };
  const _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (err) {
      console.error(err);
    }
  };
  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const _userInfo = await GoogleSignin.signIn();
      setUserInfo(_userInfo);
    } catch (err) {
      Toast.show({
        text: '로그인을 해주세요',
        buttonText: 'Okay',
        position: 'bottom',
        type: 'danger',
      });
      console.error(err);
    }
  };
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    Geolocation.getCurrentPosition(
      (location) => {
        let userGeo = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        //           userGeo 에 담는 lat, lng 값 useState 변수에 담아서 webview 에 넣어주시면 될 것 같습니다
        setLocation(userGeo);
        setLocationLoad(true);

        //return true;
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 100000},
    );
    return Geolocation.clearWatch;
  }, []);

  //구독상태 설정
  const setSubscription = async () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receiptTemp = purchase.transactionReceipt;
        if (receiptTemp) {
          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              // If consumable (can be purchased again)
              consumePurchaseAndroid(purchase.purchaseToken);
              // // If not consumable
              acknowledgePurchaseAndroid(purchase.purchaseToken);
              navigation.navigate('Depth01', {
                list: list,
                category: category,
                title: title,
              });
            }
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
          setReceipt(receiptTemp);
        }
      },
    );
  };
  //창이 닫힐때 상태 초기화 커넥션 종료
  const cwu = async () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }

    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    await RNIap.endConnection();
  };
  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };
  //인앱 결제 커넥션 초기화
  const callIap = async () => {
    try {
      const result = await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  //결제 물품 중복 구매 허용하기 위한 함수
  const InitializationPurchase = async () => {
    const result = await consumeAllItemsAndroid();
  };
  //아이템 목록 가져오기
  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      setProductList(products);
      // getAvailablePurchases();
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  const getAvailablePurchases = async (stat) => {
    setLoading(false);
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.info(
        '--------------------------------------------Available purchases :: ',
        purchases,
      );
      if (purchases && purchases.length > 0) {
        setAvailableItemsMessage(`Got ${purchases.length} items.`);
        setReceipt(purchases[0].transactionReceipt);
        setPurchase(purchases[0].productId);
        setModal(false);
      } else if (stat == 'purchase') {
        setModal(true);
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }

    setLoading(true);
  };
  //결제요청
  const requestPurchase = async () => {
    let sku = inappProduct;
    try {
      await callIap();
      const result = await RNIap.requestPurchase(sku);
      const {
        orderId,
        packageName,
        purchaseTime,
        productId,
        purchaseState,
        purchaseToken,
        acknowledged,
      } = JSON.parse(result.transactionReceipt);
      const {email, name, id} = userInfo.user;
      const date = dateFormat(new Date(purchaseTime));
      const body = {
        user_mail: email,
        user_name: name,
        user_id: id,
        order_id: orderId,
        package_name: packageName,
        purchase_time: date,
        product_id: productId,
        purchase_state: purchaseState,
        purchase_token: purchaseToken,
      };

      const response = await axios.post(`${baseURL}/json/proc_json.php`, {
        ...body,
        method: 'proc_add_insadong_order',
      });
    } catch (err) {
      console.warn(err.code, err.message);
    }
    await getAvailablePurchases();
    setModal(false);
  };
  const dateFormat = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    } ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${
      second < 10 ? '0' + second : second
    }`;
  };
  const getList = () => {
    axios({
      method: 'post',
      url: `${baseURL}/json/proc_json.php?method=proc_get_insadong_category`,
      data: qs.stringify({
        ca_name: category,
      }),
    })
      .then((res) => {
        if (res.data.resultItem.message === '조회성공') {
          setSelectList(res.data.arrItems);
        }
      })
      .catch((e) => console.log(e));
  };

  const RenderRow = ({item, idx}) => {
    return (
      <>
        <TouchableOpacity
          key={item.id}
          style={
            item.id == 27 || purchase != inappProduct
              ? {
                  ...styles.listWrap,
                  alignContent: 'center',
                  alignItems: 'center',
                }
              : {
                  ...styles.listWrap,
                }
          }
          activeOpacity={0.8}
          onPress={() => {
            item.id == 27 || purchase == inappProduct
              ? navigation.navigate('Detail', {
                  title: item.title,
                  content: item.content,
                  background: item.photo,
                  navigation: navigation,
                  subId: item.id,
                  items: item,
                })
              : _getPurchase();
          }}>
          <View style={styles.listMedia}>
            <ImageBackground
              source={{uri: `${item.photo}`}}
              resizeMode="cover"
              borderBottomLeftRadius={12}
              borderTopLeftRadius={12}
              style={{
                width: 90,
                height: 160,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}></ImageBackground>
          </View>
          <View style={styles.listTextWrap}>
            <View>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text
                style={[styles.listDesc, {lineHeight: 22}]}
                numberOfLines={3}>
                {item.content}
              </Text>
            </View>
            {/* <Text style={styles.playTime}>{`재생시간 ${item.playTime}`}</Text> */}
          </View>
          {item.id == 27 ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Image
                source={require('../assets/images/right-arrow.png')}
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 10,
                  borderColor: 'lightgray',
                  borderRadius: 1,
                }}
                resizeMode="contain"
              />
              <Text style={{fontSize: 13, color: '#666666'}}>
                {item.duration}
              </Text>
            </View>
          ) : userInfo == '' ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Text style={{fontSize: 20, color: 'red'}}>잠김</Text>
            </View>
          ) : purchase != inappProduct ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Text style={{fontSize: 20, color: 'red'}}>잠김</Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Image
                source={require('../assets/images/right-arrow.png')}
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 10,
                  borderColor: 'lightgray',
                  borderRadius: 1,
                }}
                resizeMode="contain"
              />
              <Text style={{fontSize: 13, color: '#666666'}}>
                {item.duration}
              </Text>
            </View>
          )}
          {item.id == 27 ? (
            <></>
          ) : userInfo == '' ? (
            <Image
              source={require('../assets/images/ic_sound.png')}
              resizeMode="cover"
              style={{
                backgroundColor: 'lightgray',
                width: '100%',
                height: '100%',
                opacity: 0.4,
                position: 'absolute',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : purchase != inappProduct ? (
            <Image
              source={require('../assets/images/ic_sound.png')}
              resizeMode="cover"
              style={{
                backgroundColor: 'lightgray',
                width: '100%',
                height: '100%',
                opacity: 0.4,
                position: 'absolute',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : (
            <></>
          )}
        </TouchableOpacity>
      </>
    );
  };

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = React.useRef();

  /** 웹뷰 ref */
  const handleSetRef = (_ref) => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  // const handleEndLoading = (e) => {
  //   console.log('handleEndLoading');
  //   /** rn에서 웹뷰로 정보를 보내는 메소드 */
  //   webviewRef.postMessage(
  //     console.log('로딩 완료시 webview로 정보를 보내는 곳'),
  //   );
  // };

  const onLoadWebview = () => {
    webviewRef.postMessage(location);
  };
  return (
    <>
      {loading == false ? (
        <>
          <ActivityIndicator size="large"></ActivityIndicator>
        </>
      ) : (
        <>
          <HeaderY title={title} navigation={navigation} />

          <WebView
            webviewRef={webviewRef}
            source={{
              uri: `https://dmonster1472.cafe24.com/map/index.php?lat=${location.lat}&lng=${location.lng}`,
            }}
            style={{
              width: Dimensions.get('window').width,
              height: 270,
            }}
            ref={handleSetRef}
            javaScriptEnabled={true}
            onLoad={onLoadWebview}
            // onMessage={onMessage}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -10,
              width: Dimensions.get('window').width,
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              height: 480,
              marginBottom: 10,
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              justifyContent: 'center',
            }}>
            {selectList.length > 0 ? (
              <FlatList
                data={selectList}
                renderItem={RenderRow}
                keyExtractor={(list, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                style={styles.listWrapBox}
                navigation={navigation}
              />
            ) : null}
            {selectList.length === 0 ? (
              <View style={{justifyContent: 'center'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    color: '#252525',
                  }}>
                  리스트가 없습니다.
                </Text>
              </View>
            ) : selectList.length > 0 && selectList.length < 3 ? (
              <View style={{marginBottom: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    color: '#252525',
                    paddingVertical: 7,
                    backgroundColor: '#eee',
                    borderRadius: 25,
                  }}>
                  더 이상 리스트가 없습니다.
                </Text>
              </View>
            ) : null}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            // style={{flex: 1, flexDirection: 'row'}}
            visible={modal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>사라진인사동</Text>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalText}>
                    잠김 항목을 이용하려면 결제가 필요 합니다. $$$$으로 모든
                    잠김 항목을 이용할 수 있습니다.
                  </Text>
                </View>
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={{...styles.button, ...styles.buttonClose}}
                    onPress={() => setModal(!modal)}>
                    <Text style={styles.textStyle}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => requestPurchase()}>
                    <Text style={styles.textStyle}>결제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listWrapBox: {
    backgroundColor: 'transparent',
    zIndex: 5,
    elevation: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 25,
  },
  listWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginVertical: 12,
  },
  listTextWrap: {
    flex: 1.5,
  },
  listMedia: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listDesc: {
    fontSize: 10,
    marginBottom: 15,
    color: '#888888',
  },
  playTime: {
    fontSize: 14,
    color: '#888888',
  },
  arrow: {
    fontFamily: 'xeicon',
    fontSize: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 0.3,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    height: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    width: '45%',
    margin: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#FFCF03',
  },
  buttonClose: {
    backgroundColor: '#FFCF03',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    justifyContent: 'flex-start',
  },
  footer: {flexDirection: 'row', marginTop: '10%'},
  modalHeader: {
    width: '100%',
    height: '20%',
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    width: '100%',
    height: '30%',
  },
});

// const ArrowFont = Styled.Text`
// font-size: 20px;
// font-family: 'xeicon';
// `;

export default Depth01;
