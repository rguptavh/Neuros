import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard, Alert, FlatList, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import Swipeable from 'react-native-swipeable-row';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
export default class App extends React.Component {
  state = {
    people: global.people
  }
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
  }

  profile = (person) =>{
    global.selected = person
    this.props.navigation.navigate('Profile')
  }

  _renderItem = ({ item }) => {
    return(
      <View style = {{borderTopWidth:1, borderTopColor:'#D3D3D3', paddingTop:rem*5, paddingBottom:rem*5, borderBottomWidth: item.name == global.people[global.people.length-1].name ? 1 : 0, borderBottomColor:'#D3D3D3', marginLeft:'5%'}}>
        <TouchableOpacity style = {{flex:1, width:'100%'}} onPress={() => this.profile(item)}>
        <Text style = {{fontFamily:'Droid', fontSize:rem*8}}>{item.name}</Text>
        </TouchableOpacity>
        </View>
    );

  };


  render() {
    if (global.people.length == 0) {
      return (

        <View style={styles.container}>
            <View style={{ flex: 1, width: '90%', alignItems: 'center',  marginTop: getStatusBarHeight() + wid*10 }}>
              <Text>Added people</Text>
            </View>
            <View style={{ width: '100%', flex: 6, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 25 * wid, color: 'black', fontFamily: 'WSB' }}>Please add your first person!</Text>
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
            <View style={{ flex: 1, width: '90%', alignItems: 'center',  marginTop: getStatusBarHeight() + wid*10 }}>
            <Text style = {{fontFamily:'DroidB', fontSize:Math.min(rem*20,wid*36), color:'#86BEFF'}}>Added People</Text></View>
            <View style={{ width: '100%', flex: 6 }}>
              <FlatList style={{ width: '100%' }}
                data={this.state.people}
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
                onPress={() => this.props.navigation.navigate('Main')}
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