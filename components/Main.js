import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
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

  define = async(word) => {
    let pons = await fetch('https://wordsapiv1.p.rapidapi.com/words/'+word+'/definitions', {
          
      method: 'GET',
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "c62cc4aa93msh7a8a08e670a64bap154463jsna1335d88278f"
      }
    });
    pons = await pons.json();
    if (pons.message == 'word not found'){
      return 'No definition found'
    }
    return pons.definitions[0].definition
  }

  findperson = async(papi) => {
    var listid = global.firstname + global.lastname;
    listid = listid.toLowerCase();
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
        if (pons.error){
          if (pons.error.message == 'Face list is empty.'){
          this.setState({ loading: false, camera: false });
          setTimeout(() => {  alert("You don't have any people added, please add a face to your database.")}, 100);
          }
          else{
            this.setState({ loading: false, camera: false });
            setTimeout(() => {  alert(pons.error.message)}, 100);
          }
          return
        }
        if(pons.length!=0){
          console.log(global.people)
          for (const item of global.people){
            console.log(item.id + " " + pons[0].persistedFaceId)
            if (item.id == pons[0].persistedFaceId){
              this.setState({ loading: false });
              global.selected = item
              this.props.navigation.navigate('Profile')
              return
            }
          }
          this.setState({camera: false});
          setTimeout(() => {  alert('A match was found, however you do not have a profile of them.') }, 100);
        }
        else{
          this.setState({ loading: false, camera: false });
          setTimeout(() => {  alert("This person is not in your list of people. Please retake the picture or add them to the list if you wish to recognize them in the future.");}, 100);
        }


      }
      else{
        this.setState({ loading: false, camera: false });
          setTimeout(() => {  alert("No face found in the photo. Please retake.");}, 100);
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
    var message = ""
    if (pons.objects.length != 0){
      let set = new Set()
      for (const item of pons.objects){
        set.add(item.object)
      }
      let first = true
      for (const object of set){
        if (first){
          first = false
        }
        else{
          message += '\n\n'
        }
        var definition = await this.define(object)
        message += 'Object: ' + object + '\n' + 'Definition: ' + definition
      }
      this.setState({camera: false, loading:false})
      setTimeout(() => {  Alert.alert('Objects Found', message) }, 100);
    }
    else{
      this.setState({camera: false, loading:false})
      setTimeout(() => {  alert('No items found') }, 100);
    }
    console.log(pons); 
  }

  takePicture2 = async () => {
    if (this.camera) {
      console.log('pressed papi');
      //this.setState({camera: false})
      this.setState({ loading: true, message:'Scanning for match...' });

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
      this.setState({ loading: true, message:'Scanning for match...' });

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
      this.setState({ loading: true, message:'Scanning for objects...' });

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
      this.setState({ loading: true, message:'Scanning for objects...' });

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
        return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => { this.camera = ref }}>
            <Spinner
              visible={this.state.loading}
              textContent={this.state.message}
              textStyle={styles.spinnerTextStyle}
            />
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
                  onPress={() => this.state.action=='findpers' ? this.pickImage2() : this.pickImage3()}>
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
                  onPress={() => this.state.action=='findpers' ? this.takePicture2() : this.takePicture3()}
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <View style={styles.container}>
            <View style={{ flex: 1, width: '85%', marginTop: getStatusBarHeight(), }}>
            <TouchableOpacity onPress= {() => this.props.navigation.navigate('Chat')}>
              <View style={{
                width: '100%', height: '100%', backgroundColor: '#86BEFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 3.65,

                elevation: 8,
              }}>
               
                <Text style={{ fontSize: Math.min(rem * 17.5, wid * 31.5), fontWeight: 'bold', color: 'white', fontFamily: 'DroidB' }}>{global.firstname} {global.lastname}</Text>
                
              </View>
              </TouchableOpacity>
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
                  }}onPress={() => this.props.navigation.navigate('People')}>
                    <LinearGradient
                      colors={['#B1E2FE', '#86BEFF']}
                      style={{ height: '100%', alignItems: 'center', borderRadius: 20, width: '100%', justifyContent: 'center', }}>
                      <View style={{ flex: 0.75, width: '100%' }}></View>
                      <View style={{ flex: 3, width: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/user.png')} resizeMode='contain'></Image>
                      </View>
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Added People</Text>
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
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Detect Person</Text>
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
                      <View style={{ flex: 3, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: Math.min(12.5 * rem, 22.5 * wid) }}>Detect Object</Text>
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
                  }} onPress = {() => this.props.navigation.navigate('Quiz')}>
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