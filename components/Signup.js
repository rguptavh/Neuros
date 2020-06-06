import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';

const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
export default class App extends React.Component {
  state = {
    firstname: '',
    lastname: '',
    loading:false,
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

  signup = async() => {
    this.setState({loading:true})
    if (this.state.firstname != '' && this.state.lastname != ''){
    var firstlast = this.state.firstname + this.state.lastname;
    firstlast = firstlast.toLowerCase();
    var data = {name: firstlast};
    console.log(firstlast)
    try {
      var res = await fetch('https://eastus.api.cognitive.microsoft.com/face/v1.0/facelists/'+firstlast, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '2fa437586d3e40a6a80c5280cfacd94c'
        },
        body: 
          JSON.stringify(data)    
      });
      res = await res.text();
      this.setState({loading:false})
      if (res == ''){
        global.firstname = this.state.firstname
        global.lastname = this.state.lastname
        this.props.navigation.replace('Main')
        return
      }
      res = JSON.parse(res)
      if (res.error.code == 'FaceListExists'){
        global.firstname = this.state.firstname
        global.lastname = this.state.lastname
        this.props.navigation.replace('Main')
      }
      else{
        alert("An error occured")
      }
    } catch (e) {
      console.log(res)
      console.error(e);
    }    


  }
  else{
    Alert.alert('Signup error', "Please fill all fields")
  }
}





  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <View style={styles.container}>
          <Spinner
            visible={this.state.loading}
            textContent={'Signing Up...'}
            textStyle={styles.spinnerTextStyle}
          />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <View style={{ width: entireScreenHeight / 4 * 0.8 * 0.85, height: '80%', marginTop: '15%', }}>
                <Image style={{ width: '100%', height: '100%' }} source={require('../assets/logo.png')} resizeMode='contain'></Image>
              </View>
            </View>
            <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', width: '100%' }}></View>
            <View style={{ flex: 0.75, alignItems: 'center', justifyContent: 'center', width: '100%' }}><Text style={{ fontSize: Math.min(30 * rem, 54 * wid), color: '#86BEFF', fontWeight: 'bold', }}>Welcome.</Text></View>
            <View style={{ flex: 1.5, width: '85%', alignItems: 'flex-end', justifyContent: 'center' }}>
              <View style={{ width: '100%', height: '80%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <View style={{
                  width: '100%',
                  flex: 1.5,
                  borderColor: '#000000',
                  borderWidth: 2,
                  borderRadius: 15,
                }}>
                  <TextInput
                    style={{ fontSize: 12 * rem, width: '95%', height: '100%', marginLeft: '5%' }}
                    autoCapitalize='none'
                    autoCompleteType='off'
                    placeholder="First Name"
                    placeholderTextColor="#4F4F4F"
                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                    onChangeText={(value) => this.setState({ firstname: value })}
                    value={this.state.firstname}

                  /></View>
                <View style={{ width: '100%', flex: 1 }}></View>
                <View style={{
                  width: '100%',
                  flex: 1.5,
                  borderColor: '#000000',
                  borderWidth: 2,
                  borderRadius: 15
                }}>
                  <TextInput
                    style={{ fontSize: 12 * rem, width: '95%', height: '100%', marginLeft: '5%' }}
                    autoCapitalize='none'
                    autoCompleteType='off'
                    placeholder="Last Name"
                    placeholderTextColor="#4F4F4F"
                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                    onChangeText={(value) => this.setState({ lastname: value })}
                    value={this.state.lastname}

                  />
                </View>
                <View style={{ width: '100%', flex: 1 }}></View>

              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
              <TouchableOpacity style = {{height:'40%', width:'60%', borderRadius:30, alignItems:'center', justifyContent:'center'}} onPress={() => this.signup()}>
                <LinearGradient
                  colors={['#D3E5FF', '#86BEFF']}
                  style={{ height: '100%', alignItems: 'center', borderRadius: 30, width: '100%', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: Math.min(25 * rem, 45 * wid), textAlign: 'center', fontWeight:'bold' }}>Enter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  },
  spinnerTextStyle: {
    color: '#FFF',
    top: 60
  },
});