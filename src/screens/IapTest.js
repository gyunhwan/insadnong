import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import React, {useState, useEffect, useStateCallback, useContext} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {UserContext} from './Common/UserContexetProvider';

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const IapTest = (props) => {
  const [productList, setProductList] = useState([]);
  const [receipt, setReceipt] = useState('');
  const [purchase, setPurchase] = useState('');
  const [availableItemsMessage, setAvailableItemsMessage] = useState('');
  const itemSkus = Platform.select({
    ios: [
      'com.cooni.point1000',
      'com.cooni.point5000', // dooboolab
    ],
    android: [
      'south.insadong1',
      'east.insadong1',
      'north.insadong1',

      // 'point_1000', '5000_point', // dooboolab
    ],
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '324854429229-cibnt7najmm42aol2n0p7t520jnii03o.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    });
    callIap();
    getAvailablePurchases();
    InitializationPurchase();
    setSubscription();
    _signOut();
    return cwu;
  }, []);

  const _signOut = async () => {
    const result = await GoogleSignin.isSignedIn();
    if (result != false) {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (err) {
        console.error(err);
      }
    }
  };
  const setSubscription = async () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receiptTemp = purchase.transactionReceipt;
        if (receiptTemp) {
          try {
            const ackResult = await finishTransaction(purchase);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
          setReceipt(receiptTemp);
        }
      },
    );
  };
  useEffect(() => {
    console.log(receipt);
  }, [receipt]);
  const cwu = () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  };
  const callIap = async () => {
    try {
      const result = await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  const InitializationPurchase = async () => {
    const result = await consumeAllItemsAndroid();
    console.log(JSON.stringify(result));
  };
  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);

      setProductList(products);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  const getAvailablePurchases = async () => {
    setLoading(false);
    try {
      const purchases = await RNIap.getAvailablePurchases();

      if (purchases && purchases.length > 0) {
        setAvailableItemsMessage(`Got ${purchases.length} items.`);
        setReceipt(purchases[0].transactionReceipt);
        setPurchase(purchases[0].productId);
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
    setLoading(true);
  };
  const requestPurchase = async (sku) => {
    try {
      await callIap();
      const result = await RNIap.requestPurchase(sku);

      const {transactionReceipt} = result;
      const {
        orderId,
        packageName,
        purchaseTime,
        productId,
        purchaseState,
        purchaseToken,
        acknowledged,
      } = JSON.parse(transactionReceipt);

      const date = dateFormat(new Date(purchaseTime));
      // console.log('dddddddddddddddddddddddddddddddddddddddddddddddd', date);
    } catch (err) {
      console.warn(err.code, err.message);
    }
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
  const requestSubscription = async (sku) => {
    try {
      await callIap();
      await RNIap.requestSubscription(sku);
    } catch (err) {
      Alert.alert(err.message);
    }
  };
  const receipt100 = receipt.substring(0, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>react-native-iap V3</Text>
      </View>
      <View style={styles.content}>
        <ScrollView style={{alignSelf: 'stretch'}}>
          <View style={{height: 50}} />
          <TouchableOpacity onPress={() => getAvailablePurchases()}>
            <Text> Get available purchases</Text>
          </TouchableOpacity>

          <Text style={{margin: 5, fontSize: 15, alignSelf: 'center'}}>
            {availableItemsMessage}
            22
          </Text>

          <Text style={{margin: 5, fontSize: 9, alignSelf: 'center'}}>
            {receipt100}
            333
          </Text>

          <TouchableOpacity onPress={() => getItems()}>
            <Text>Get Products ({productList.length})</Text>
          </TouchableOpacity>
          {productList.map((product, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 12,
                    color: 'black',

                    minHeight: 100,
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                  }}>
                  {JSON.stringify(product)}
                </Text>
                <TouchableOpacity
                  onPress={() => requestPurchase(product.productId)}
                  // onPress={() => requestSubscription(product.productId)}
                  style={styles.btn}
                  textStyle={styles.txt}>
                  <Text> Request purchase for above product</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    paddingTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    backgroundColor: 'white',
  },
  header: {
    flex: 20,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTxt: {
    fontSize: 26,
    color: 'green',
  },
  content: {
    flex: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  btn: {
    height: 48,
    width: 240,
    alignSelf: 'center',
    backgroundColor: '#00c40f',
    borderRadius: 0,
    borderWidth: 0,
  },
  txt: {
    fontSize: 16,
    color: 'white',
  },
});

export default IapTest;
