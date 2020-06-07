import React from 'react';
import { StyleSheet, Text, View, AppLoading, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import * as Font from 'expo-font';
import signup from './components/Signup';
import main from './components/Main';
import memory from './components/Memory';
import add from './components/Add';
import quiz from './Playquiz';
import people from './components/People';
import profile from './components/Profile';

let signedup = false

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
    console.log(global.people)
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
