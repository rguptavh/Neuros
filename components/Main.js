import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as ImageManipulator from "expo-image-manipulator";
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';



const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
export default class App extends React.Component {
  state = {
    firstname: '',
    lastname: '',
    loading: false,
    cameraType: Camera.Constants.Type.front,
    camera: false,
    hasPermission: null,
    action: '',
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
  getPermissionAsync = async () => {
    // Camera roll Permission 
    var roll = true;
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        roll = false
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' && roll });
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

  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }

  findperson = async(papi) => {
    var listid = 'bruhbruh';
    try {
      let res = await fetch('https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&recognitionModel=recognition_01&detectionModel=detection_01', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': '2fa437586d3e40a6a80c5280cfacd94c',
        },
        body: 
          papi,
      
      });


      res = await res.json();
      if(res.length!=0){
        console.log(res)
        var id = res[0].faceId;
        var data = {faceId: id, FaceListId: listid, maxNumOfCandidatesReturned: 1, mode: 'matchPerson'};
        console.log(id);
        let pons = await fetch('https://eastus.api.cognitive.microsoft.com/face/v1.0/findsimilars', {
          
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '2fa437586d3e40a6a80c5280cfacd94c',
          },
          body: 
            JSON.stringify(data)
        
        });
        pons = await pons.json();
        console.log('i');
        console.log(pons);
        this.setState({ loading: false });
        this.setState({camera: false});

      }
      else{
        alert("No person found in database");
      }

    } catch (e) {
      console.error(e);
    } 

  }

  findobjects = async(papi) => {
    let pons = await fetch('https://eastus.api.cognitive.microsoft.com/vision/v2.0/detect', {
          
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': '8dcc812d270747cf81ae4aab6955b303',
      },
      body: 
        papi
    
    });
    pons = await pons.json();
    console.log(pons); 
  }

  takePicture2 = async () => {
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
          this.findperson(blob);

      }).catch((error) => {
        throw error;
      }); 
      //console.log(JSON.stringify(global.papito))

    }
  }
  pickImage2 = async () => {
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
          this.findperson(blob);

      }).catch((error) => {
        throw error;
      }); 
    }
  }
  takePicture3 = async () => {
    if (this.camera) {
      console.log('pressed papi');
      //this.setState({camera: false})
      this.setState({ loading: true });

      let photo = await this.camera.takePictureAsync();
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );


      this.uriToBlob(manipResult.uri).then((blob)  => {
          global.papito = blob;
          console.log(JSON.stringify(global.papito))
          this.findobjects(blob);

      }).catch((error) => {
        throw error;
      }); 
      //console.log(JSON.stringify(global.papito))

    }
  }
  pickImage3 = async () => {
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
          this.findobjects(blob);

      }).catch((error) => {
        throw error;
      }); 
    }
  }

  openpersoncam = async() => {
    if (!this.state.hasPermission) {
      await this.getPermissionAsync();
    }
    console.log(this.state.hasPermission)
    if (this.state.hasPermission) {
      console.log('hii')
      this.setState({action: 'findpers'});
      this.setState({camera: true});   
    }
    else {
      alert('Please enable Camera and Camera Roll permissions')
    }

  }
  openobjcam = async() => {
    if (!this.state.hasPermission) {
      await this.getPermissionAsync();
    }
    console.log(this.state.hasPermission)
    if (this.state.hasPermission) {
      console.log('hii')
      this.setState({action: 'findobj'});
      this.setState({camera: true});  
    }
    else {
      alert('Please enable Camera and Camera Roll permissions')
    }

  }



  render() {
    if(this.state.camera){
      if(this.state.action=='findpers'){
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
                  onPress={() => this.pickImage2()}>
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
                  onPress={() => this.takePicture2()}
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
      else{
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
                  onPress={() => this.setState({camera: false})}>
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
                  onPress={() => this.pickImage3()}>
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
                  onPress={() => this.takePicture3()}
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
    }
    else{
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
                <Text style={{ fontSize: Math.min(rem * 17.5, wid * 31.5), fontWeight: 'bold', color: 'white', fontFamily: 'DroidB' }}>{global.name}</Text>
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
                  }} onPress={() => this.props.navigation.navigate('Add')}>
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
                  }} onPress = {() => this.openpersoncam()}>
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
                  }} onPress = {() => this.openobjcam()}>
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
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Match Game</Text>
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
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/question.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Trivia</Text>
                      </View>
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