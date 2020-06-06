import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
export default class App extends React.Component {
  state = {
    firstname: '',
    lastname: '',
  }
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
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <View style={styles.container}>
            <View style={{ flex: 1, width: '85%', marginTop: getStatusBarHeight(), }}>
              <View style={{
                width: '100%', height: '100%', backgroundColor: '#86BEFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 3.65,

                elevation: 8,
              }}>
                <Text style={{ fontSize: Math.min(rem * 17.5, wid * 31.5), fontWeight: 'bold', color: 'white', fontFamily:'DroidB' }}>{global.name}</Text>
              </View>
            </View>
            <View style={{ flex: 0.5, width: '100%' }}></View>
            <View style={{ flex: 9, width: '90%' }}>
              <View style={{ width: '100%', flex: 1, flexDirection: 'row' }}>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/plus.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Add Person</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.15, height: '95%' }}></View>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/user.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Your People</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 0.05 }}></View>
              <View style={{ width: '100%', flex: 1, flexDirection: 'row' }}>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/org.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.15, height: '95%' }}></View>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/cube.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%' }}></View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 0.05 }}></View>
              <View style={{ width: '100%', flex: 1, flexDirection: 'row' }}>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }} onPress={() => this.props.navigation.navigate('Memory')}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/puzzle.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%' }}></View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.15, height: '95%' }}></View>
                <View style={{
                  flex: 1, height: '95%',
                }}>
                  <TouchableOpacity style={{
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 3.65,

                    elevation: 8,
                  }}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/question.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%' }}></View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 0.5, width: '100%' }}></View>
          </View>
        </TouchableWithoutFeedback>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#DAF8FF'
  },
});