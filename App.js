import React from 'react';
import { StyleSheet, Text, View, AppLoading } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import * as Font from 'expo-font';
import signup from './components/Signup';
import main from './components/Main';
import memory from './components/Memory';
import add from './components/Add';
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
