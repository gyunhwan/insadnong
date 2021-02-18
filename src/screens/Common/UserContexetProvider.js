import React, {useState, useEffect, createContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const UserContext = createContext({});

const UserContextProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState([]);
  const login = (_userInfo) => {
    setUserInfo(_userInfo);
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };
  const logout = () => {
    setUserInfo([]);
    AsyncStorage.setItem('userInfo', '');
  };
  const initData = async () => {
    try {
      const list = await AsyncStorage.getItem('userInfo');
      if (list == null) {
        setUserInfo(JSON.parse(list));
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    initData();
  }, []);
  return (
    <UserContext.Provider value={{userInfo, login, logout}}>
      {children}
    </UserContext.Provider>
  );
};
export {UserContextProvider, UserContext};
