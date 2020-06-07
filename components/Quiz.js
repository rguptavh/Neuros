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
  TouchableOpacity
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
let arr = ["Jack", "Bobby", "Rahul", "Anirudh"]

function newCorrect() {
  return arr[Math.floor(Math.random() * arr.length)];

}
function newIncorrect(correct) {
  let thing = correct
  var i
  while (thing == correct) {
    i = Math.floor(Math.random() * arr.length)
    thing = arr[i]
  }
  arr.splice(i, 1)

  return thing
}
function newQuestion1() {
  const arr2 = [...arr]
  let correctword = newCorrect()
  json = {
    "correctoption": "option3",
    "options": {
      "option1": newIncorrect(correctword),
      "option2": newIncorrect(correctword),
      "option3": correctword,
      "option4": newIncorrect(correctword)
    },
    "question": "Who is this person?"
  }
  arr = arr2
  return json
}
function newQuestion2() {
  const arr2 = [...arr]
  let correctword = newCorrect()
  json = {
    "correctoption": "option2",
    "options": {
      "option1": newIncorrect(correctword),
      "option2": correctword,
      "option3": newIncorrect(correctword),
      "option4": newIncorrect(correctword)
    },
    "question": "Who is this person?"
  }
  arr = arr2
  return json
}
function newQuestion3() {
  const arr2 = [...arr]
  let correctword = newCorrect()
  json = {
    "correctoption": "option1",
    "options": {
      "option1": correctword,
      "option2": newIncorrect(correctword),
      "option3": newIncorrect(correctword),
      "option4": newIncorrect(correctword)
    },
    "question": "Who is this person?"
  }
  arr = arr2
  return json
} function newQuestion4() {
  const arr2 = [...arr]
  let correctword = newCorrect()
  json = {
    "correctoption": "option4",
    "options": {
      "option1": newIncorrect(correctword),
      "option2": newIncorrect(correctword),
      "option3": newIncorrect(correctword),
      "option4": correctword
    },
    "question": "Who is this person?"
  }
  arr = arr2
  return json
}
const jsonData = {
  "quiz": {
    "quiz1": {
      "question1": newQuestion1(),
      "question2": newQuestion2(),
      "question3": newQuestion3(),
      "question4": newQuestion4(),
      "question5": newQuestion1()
    }
  }
}
export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.qno = 0
    this.score = 0

    const jdata = jsonData.quiz.quiz1
    arrnew = Object.keys(jdata).map(function (k) { return jdata[k] });
    this.state = {
      question: arrnew[this.qno].question,
      options: arrnew[this.qno].options,
      correctoption: arrnew[this.qno].correctoption,
      countCheck: 0,
      status: false
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
      this.setState({ countCheck: 0, question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption: arrnew[this.qno].correctoption, status: false })
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
      <View style={styles.container}>

        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: getStatusBarHeight() + rem*5 }}>

          <View style={styles.oval} >
            <Text style={styles.welcome}>
              {this.state.question}
            </Text>
          </View>
          <View style={{ flex: 6 }}>
          </View>
          <View style = {{flex:1}}></View>
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
          <View style = {{flex:0.6}}>
            <Button
              onPress={() => this.next()}
              title="Next"
              color="black"
            />

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
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});