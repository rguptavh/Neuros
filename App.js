import React from 'react';
import { StyleSheet, Text, View, AppLoading } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import signup from './components/Signup';
import main from './components/Main';
let signedup = true

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
  componentDidMount() {
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
