import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animbutton from './Animbutton'
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { NativeViewGestureHandler } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window')
const entireScreenHeight = Dimensions.get('window').height;
const rem = entireScreenHeight / 380;
const entireScreenWidth = Dimensions.get('window').width;
const wid = entireScreenWidth / 380;
let arrnew = []
var json



export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.qno = 0
    this.score = 0
    var arr = global.people



    //function to retrieve data


    //function call
    function randQustion() {
      switch (Math.floor(Math.random() * 4) + 1) {
        case 1:
          return newQuestion1()
        case 2:
          return newQuestion2()
        case 3:
          return newQuestion3()

        case 4:
          return newQuestion3()
        default:
          return "nothing"
      }
    }
    function newCorrect() {

      return arr[Math.floor(Math.random() * arr.length)];

    }
    function newIncorrect(correct) {

      let thing = correct
      var i
      while (thing == correct) {
        i = Math.floor(Math.random() * arr.length)
        thing = arr[i].name
      }
      arr.splice(i, 1)

      return thing
    }
    function newQuestion1() {
      const arr2 = [...arr]
      let corr = newCorrect()

      let correctword = corr.name
      json = {
        "correctoption": "option3",
        "options": {
          "option1": newIncorrect(correctword),
          "option2": newIncorrect(correctword),
          "option3": correctword,
          "option4": newIncorrect(correctword)
        },
        "question": corr.photo
      }
      arr = arr2
      return json
    }
    function newQuestion2() {
      const arr2 = [...arr]
      let corr = newCorrect()

      let correctword = corr.name
      json = {
        "correctoption": "option2",
        "options": {
          "option1": newIncorrect(correctword),
          "option2": correctword,
          "option3": newIncorrect(correctword),
          "option4": newIncorrect(correctword)
        },
        "question": corr.photo
      }
      arr = arr2
      return json
    }
    function newQuestion3() {
      const arr2 = [...arr]
      let corr = newCorrect()

      let correctword = corr.name
      json = {
        "correctoption": "option1",
        "options": {
          "option1": correctword,
          "option2": newIncorrect(correctword),
          "option3": newIncorrect(correctword),
          "option4": newIncorrect(correctword)
        },
        "question": corr.photo
      }
      arr = arr2
      return json
    } function newQuestion4() {
      const arr2 = [...arr]
      let corr = newCorrect()

      let correctword = corr.name
      json = {
        "correctoption": "option4",
        "options": {
          "option1": newIncorrect(correctword),
          "option2": newIncorrect(correctword),
          "option3": newIncorrect(correctword),
          "option4": correctword
        },
        "question": corr.photo
      }
      arr = arr2
      return json
    }
    const jsonData = {
      "quiz": {
        "quiz1": {
          "question1": randQustion(),
          "question2": randQustion(),
          "question3": randQustion(),
          "question4": randQustion(),
          "question5": randQustion()
        }
      }
    }

    const jdata = jsonData.quiz.quiz1
    arrnew = Object.keys(jdata).map(function (k) { return jdata[k] });
    this.state = {
      question: arrnew[this.qno].question,
      options: arrnew[this.qno].options,
      correctoption: arrnew[this.qno].correctoption,
      countCheck: 0,
      status: false,
      photo: "",
    }

  }
  prev() {
    if (this.qno > 0) {
      this.qno--
      this.setState({ question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption: arrnew[this.qno].correctoption })
    }
  }
  next() {
    if (this.qno < arrnew.length - 1) {
      this.qno++
      this.setState({ countCheck: 0, question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption: arrnew[this.qno].correctoption, status: false, photo: arrnew[this.qno].photos })
    } else {
      this.props.quizFinish(this.score * 100 / 5)
    }
  }
  _answer(status, ans) {

    if (status == true) {
      const count = this.state.countCheck + 1;
      this.setState({ countCheck: count })
      if (ans == this.state.correctoption) {
        this.score += 1
        this.next()

        Alert.alert("Good Job! You got it correct");
      }
      else {
        const count = this.state.countCheck - 1;
        this.setState({ countCheck: count })
        if (this.state.countCheck < 1 || ans == this.state.correctoption) {
          //Alert.alert("Please Try Again");
          this.score -= 1;

        }
      }

    }
  }

  render() {
    let status = this.state.status
    let _this = this
    const currentOptions = this.state.options
    const options = Object.keys(currentOptions).map(function (k) {
      return (<View key={k} style={{ margin: 10, }}>

        <Animbutton status={status} countCheck={_this.state.countCheck} onColor={"green"} effect={"tada"} _onPress={(status) => _this._answer(status, k)} text={currentOptions[k]} />

      </View>)
    });

    return (

      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: getStatusBarHeight() + rem * 5 }}>

        <View style={styles.oval} >
          <Text style={styles.welcome}>
            {"Who is this?"}
          </Text>
        </View>
        <View style = {{flex:0.5}}></View>
        <View style={{ flex: 6, width:'90%' }}>
        <Image style={{ width: '100%', height: '100%' }} source={{ uri: this.state.question }} resizeMode='contain'></Image>
        </View>
          <View style = {{flex:0.5}}></View>
          <View style={{ flex: 1, flexDirection: 'row' }}>

            <View style={{ flex: 1 }}>
              {options[0]}
            </View>
            <View style={{ flex: 1 }}>
              {options[1]}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              {options[2]}
            </View>
            <View style={{ flex: 1 }}>
              {options[3]}
            </View>
          </View>

        </View>
    );
  }
}





const styles = StyleSheet.create({

  oval: {
    width: width * 90 / 100,
    borderRadius: 20,
    flex: 1,
    backgroundColor: '#86BEFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DAF8FF'
  },
  welcome: {
    fontSize: Math.min(rem * 15, wid * 36),
    margin: 15,
    color: "white",
    fontFamily:'DroidB'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});
