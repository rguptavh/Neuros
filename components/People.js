import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard, Alert, FlatList, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import Swipeable from 'react-native-swipeable-row';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
export default class App extends React.Component {
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
  }



  _renderItem = ({ item }) => {
    const rightButtons = [
      <TouchableHighlight style={{ backgroundColor: 'red', height: '100%', justifyContent: 'center', marginLeft: wid * 5 }} onPress={() => this.deleteNote(item)}><Text style={{ color: 'white', paddingLeft: entireScreenHeight / 50 }}>Delete</Text></TouchableHighlight>,];
    var f = false
    if (first) {
      f = true;
      first = false;
    }
    if (item.add) {
      return (
        <View style={{ height: rem * 35, width: '100%', marginTop: rem * 7 }}>
          <TouchableOpacity style={{ height: '60%', width: '100%', flexDirection: 'row', alignItems: 'center', }} onPress={this.addmemory}>
            <Image style={{ flex: 0.75, width: '100%', height: '100%', }} source={require('../assets/plus.png')} resizeMode='contain'>
            </Image>
            <View style={{ flex: 0.2 }}></View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontFamily: 'Droid', fontSize: rem * 15 }}>Add Memory</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (

        <View style={{ width: '100%', marginTop: rem * 7, backgroundColor: '#DAF8FF' }}>
          <Swipeable rightButtons={rightButtons} rightButtonWidth={entireScreenWidth / 5} bounceOnMount={f}>
            <View style={{ width: '100%', flexDirection: 'row', }}>
              <View style={{ flex: 1, borderWidth: 2, borderRadius: 20, justifyContent: 'center', paddingTop: rem * 2, paddingBottom: rem * 2 }}>
                <TextInput style={{ flex: 1, width: '90%', marginLeft: '5%', fontFamily: 'Droid', fontSize: rem * 15 }} multiline={true} placeholder="Memory" onChangeText={(value) => {
                  var temp = this.state.memories;
                  temp[item.index]["memory"] = value;
                  this.setState({ items: temp })
                  console.log(this.state.memories)
                }}></TextInput>
              </View>
            </View>
          </Swipeable>
        </View>

      );
    }

  };


  render() {
    if (global.people.length == 0) {
      return (

        <View style={styles.container}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/pastdrives.png')} style={{
                height: '100%',
                width: '84%',
                marginTop: '10%',
                flex: 1,
              }} resizeMode="contain"></Image>
            </View>
            <View style={{ width: '100%', flex: 6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 25 * wid, color: 'white', fontFamily: 'WSB' }}>Please log your first drive!</Text>
            </View>
            <View style={{
              width: '73%',
              flex: 1,
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={{
                  height: entireScreenWidth * 0.73 * 276 / 1096,
                  width: '100%',
                }}
                onPress={onPress}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/backbut.png')} style={{
                  height: '100%',
                  width: '100%',
                  flex: 1


                }} resizeMode="contain"></Image>
              </TouchableOpacity>
            </View>
        </View>
      );
    }
    else {
      return (

        <View style={styles.container}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center' }}>
              <Image source={require('../assets/pastdrives.png')} style={{
                height: '100%',
                width: '100%',
                marginTop: '10%',
                flex: 1,
              }} resizeMode="contain"></Image></View>
            <View style={{ width: '100%', flex: 6 }}>
              <FlatList style={{ width: '100%' }}
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
              />
            </View>
            <View style={{
              width: '73%',
              flex: 1,
              paddingBottom: '2%',
              paddingTop: '2%',
              justifyContent: 'center',
              alignItems: 'center'

            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  width: entireScreenHeight / 8 * 0.96,
                }}
                onPress={onPress}
                disabled={this.state.loading}

              >
                <Image source={require('../assets/backbut.png')} style={{
                  height: '100%',
                  width: '100%',
                  flex: 1


                }} resizeMode="contain"></Image>
              </TouchableOpacity>
            </View>
        </View>
      );
    }
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