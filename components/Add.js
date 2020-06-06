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
export default class App extends React.Component {
  state = {
    firstname: '',
    lastname: '',
    loading: false,
    memories: [{ index: 0, memory:'', add: false }, { index: 1, memory: '', add: true }],
    camera: false,
    cameraType: Camera.Constants.Type.back,
    photo: require('../assets/plus.png')
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
  uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }
  addmemory = () => {
    var temp = this.state.memories;
      temp.splice(temp.length - 1, 0, { index: temp.length - 1, memory:'' });
      temp[temp.length - 1]["index"] = temp.length - 1;
      this.setState({ memories: temp });
  }
  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }
  addperson = async(papi) => {
    var listid = 'bruhbruh';
    try {
      let res = await fetch('https://eastus.api.cognitive.microsoft.com/face/v1.0/facelists/'+listid+'/persistedFaces?detectionModel=detection_01', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': '2fa437586d3e40a6a80c5280cfacd94c',
        },
        body: 
          papi,
      
      });
      this.setState({ loading: false });

      res = await res.json();
      if(res.length!=0){
        console.log(res)
        this.setState({camera: false});

      }
      else{
        alert("No face detected in the photo. Please retake");
      }

    } catch (e) {
      console.error(e);
    } 

  }

  takePicture = async () => {
    if (this.camera) {
      console.log('pressed papi');
      //this.setState({camera: false})
      this.setState({ loading: true });

      let photo = await this.camera.takePictureAsync();
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );


      this.uriToBlob(manipResult.uri).then((blob)  => {
          global.papito = blob;
          console.log(JSON.stringify(global.papito))
          this.addperson(blob);

      }).catch((error) => {
        throw error;
      }); 
      //console.log(JSON.stringify(global.papito))

    }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    if (!result.cancelled) {
      this.setState({ loading: true });

      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );
        this.uriToBlob(manipResult.uri).then((blob)  => {
          global.papito = blob;
          console.log(JSON.stringify(global.papito))
          this.addperson(blob);

      }).catch((error) => {
        throw error;
      }); 
    }
  }

  addition = () =>{
    var persons = AsyncStorage.getItem('people');


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

  getPermissionAsync = async () => {
    // Camera roll Permission 
    var cameraroll = true;
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        cameraroll = false
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' && cameraroll });
  }

  render() {
    if (this.state.camera) {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => { this.camera = ref }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 30 }}>
              
            <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}
                onPress={() => this.setState({camera:false})}>
                <Ionicons
                  name="ios-arrow-back"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}
                onPress={() => this.pickImage()}>
                <Ionicons
                  name="ios-photos"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.takePicture()}
              >
                <FontAwesome
                  name="camera"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.handleCameraType()}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
          <View style={styles.container}>
            <Spinner
              visible={this.state.loading}
              textContent={'Adding Person...'}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', }}>
              <TouchableOpacity style={{ width: entireScreenHeight / 4 * 0.8 * 0.85, height: '80%', marginTop: '15%', }} onPress={async () => {
                if (!this.state.hasPermission) {
                  await this.getPermissionAsync();
                }
                console.log(this.state.hasPermission)
                if (this.state.hasPermission) {
                  console.log('hii')
                  this.setState({ camera: true })
                }
                else {
                  alert('Please enable Camera and Camera Roll permissions')
                }
              }}>
                <Image style={{ width: '100%', height: '100%' }} source={this.state.photo} resizeMode='contain'></Image>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', width: '100%' }}></View>
            <View style={{ flex: 0.75, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <View style={{ borderBottomColor: '#86BEFF', borderBottomWidth: 8, width: '80%', alignItems: 'center' }}>
                <TextInput
                  style={{ fontSize: 15 * rem, fontFamily: 'DroidB', color: '#86BEFF' }}
                  autoCapitalize='none'
                  autoCompleteType='off'
                  placeholder="Full Name"
                  placeholderTextColor="#86BEFF"
                  keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                  onChangeText={(value) => this.setState({ firstname: value })}
                  value={this.state.firstname}

                />
              </View>
            </View>
            <View style={{ flex: 1.5, width: '85%', alignItems: 'flex-end', justifyContent: 'center' }}>
              <FlatList style={{ width: '100%', backgroundColor: '#DAF8FF' }}
                data={this.state.memories}
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