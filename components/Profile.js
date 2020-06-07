import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard, Alert, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import Swipeable from 'react-native-swipeable-row';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";



const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
var first = true
var uri = null
export default class App extends React.Component {
  state = {
    person: global.selected
  }
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
  }

  _renderItem = ({ item }) => {
    console.log(this.state.person.photo + 'uri')
    if (item.add) {
      return null
    }
    else {
      return (

        <View style={{ width: '100%', marginTop: rem * 7, backgroundColor: '#DAF8FF' }}>
            <View style={{ width: '100%', flexDirection: 'row', }}>
              <View style={{ flex: 1, borderWidth: 2, borderRadius: 20, justifyContent: 'center', paddingTop: rem * 2, paddingBottom: rem * 2 }}>
                <Text style={{ flex: 1, width: '90%', marginLeft: '5%', fontFamily: 'Droid', fontSize: rem * 12 }}>{item.memory}</Text>
              </View>
            </View>
        </View>

      );
    }

  };


  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
          <View style={styles.container}>
            <Spinner
              visible={this.state.loading}
              textContent={'Adding Person...'}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', }}>
              <View style={{ width: entireScreenHeight / 2.5 * 0.8 * 0.85, height: '80%', marginTop: '15%', }}>
                <Image style={{ width: '100%', height: '100%' }} source={{uri : this.state.person.photo}} resizeMode='contain'></Image>
              </View>
            </View>
            <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', width: '100%' }}></View>
            <View style={{ flex: 0.75, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <View style={{ borderBottomColor: '#86BEFF', borderBottomWidth: 8, width: '80%', alignItems: 'center' }}>
                <Text style={{ fontSize: 15 * rem, fontFamily: 'DroidB', color: '#86BEFF' }}>{this.state.person.name}</Text>
              </View>
            </View>
            <View style={{ flex: 1.5, width: '85%', alignItems: 'flex-end', justifyContent: 'center' }}>
              <FlatList style={{ width: '100%', backgroundColor: '#DAF8FF' }}
                data={this.state.person.memories}
                renderItem={this._renderItem}

                keyExtractor={item => "" + item.index}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
              <View style={{ width: '100%', height: '90%', alignItems: 'center' }}>
                <TouchableOpacity style={{
                  height: '44%', width: '60%', borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.30,
                  shadowRadius: 3.65,

                  elevation: 8,
                }} onPress={() => this.addition()}>
                  <View
                    style={{ height: '100%', alignItems: 'center', borderRadius: 30, width: '100%', justifyContent: 'center', backgroundColor: '#93C7FF' }}>
                    <Text style={{ color: 'white', fontSize: Math.min(25 * rem, 45 * wid), textAlign: 'center', fontWeight: 'bold', fontFamily: 'DroidB' }}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </KeyboardAvoidingView >
    );

  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DAF8FF'
  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },
});