import * as Font from 'expo-font';
import * as firebase from 'firebase';
import React from 'react';
import { AsyncStorage, StyleSheet, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import add from './components/Add';
import main from './components/Main';
import memory from './components/Memory';
import people from './components/People';
import profile from './components/Profile';
import signup from './components/Signup';
import quiz from './Playquiz';
import chat from './components/Chat';

let signedup = false
console.disableYellowBox = true;
var firebaseConfig = {
  apiKey: "AIzaSyBCwgl2VgGc_rTcm2FK7Pm0xQ5wrrxXhgM",
  authDomain: "neuros.firebaseapp.com",
  databaseURL: "https://neuros.firebaseio.com",
  projectId: "neuros",
  storageBucket: "neuros.appspot.com",
  messagingSenderId: "662909994780",
  appId: "1:662909994780:web:ea25f0023da4971bfc9cd9"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default class App extends React.Component {
  state = {
    assetsLoaded: false,
  };
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
  }
  async componentDidMount() {
    await Font.loadAsync({
      'DroidB': require('./assets/fonts/DroidSans-Bold.ttf'),
      'Droid': require('./assets/fonts/DroidSans.ttf'),
    });
    global.people = JSON.parse(await AsyncStorage.getItem('people'));
    var firstname = await AsyncStorage.getItem('firstname')
    var lastname = await AsyncStorage.getItem('lastname')
    console.log(firstname)
    if (firstname != null && lastname != null){
      global.firstname = firstname
      global.lastname = lastname
    }
    this.setState({ assetsLoaded: true });
  }
  
  
  
  
  render() {
    if (!this.state.assetsLoaded) {
      return null;
  }

      const AppNavigator = createStackNavigator({
        Signup: {
          screen:signup
        },
        Main: {
          screen:main
        },
        Memory: {
          screen:memory
        },
        Add: {
          screen:add
        },
        Quiz: {
          screen:quiz
        },
        People: {
          screen:people
        },
        Profile: {
          screen:profile
        },
        Chat: {
          screen:chat
        },
      },
        {
          initialRouteName: signedup ? 'Main' : 'Signup',
          headerMode:'none'
        });

      const AppContainer = createAppContainer(AppNavigator);
      return(
      <AppContainer/>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
