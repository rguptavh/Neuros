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

import { NativeViewGestureHandler } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window')
let arrnew = []
var json
let arr = ["Jack","Bobby","Rahul","Anirudh"]

function newCorrect(){
  return arr[Math.floor(Math.random() * arr.length)];

}
function newIncorrect(correct){
  let thing  = correct
  var i
  while(thing == correct){
    i = Math.floor(Math.random() * arr.length)
    thing  = arr[i]
  }
  arr.splice(i ,1)

  return thing
}
function newQuestion1(){
    const arr2 = [...arr]
    let correctword =  newCorrect()
    json =  {
    "correctoption" : "option3",
    "options" : {
      "option1" : newIncorrect(correctword),
      "option2" : newIncorrect(correctword),
      "option3" : correctword,
      "option4" : newIncorrect(correctword)
    },
    "question" : "Who is this person?"
  }
  arr = arr2
  return json
}
function newQuestion2(){
  const arr2 = [...arr]
  let correctword =  newCorrect()
  json =  {
  "correctoption" : "option2",
  "options" : {
    "option1" : newIncorrect(correctword),
    "option2" : correctword,
    "option3" :  newIncorrect(correctword),
    "option4" : newIncorrect(correctword)
  },
  "question" : "Who is this person?"
}
arr = arr2
return json
}
function newQuestion3(){
  const arr2 = [...arr]
  let correctword =  newCorrect()
  json =  {
  "correctoption" : "option1",
  "options" : {
    "option1" : correctword,
    "option2" : newIncorrect(correctword),
    "option3" : newIncorrect(correctword),
    "option4" : newIncorrect(correctword)
  },
  "question" : "Who is this person?"
}
arr = arr2
return json
}function newQuestion4(){
  const arr2 = [...arr]
  let correctword =  newCorrect()
  json =  {
  "correctoption" : "option4",
  "options" : {
    "option1" : newIncorrect(correctword),
    "option2" : newIncorrect(correctword),
    "option3" : newIncorrect(correctword),
    "option4" : correctword
  },
  "question" : "Who is this person?"
}
arr = arr2
return json
}
const jsonData = {"quiz" : {
  "quiz1" : {
    "question1" : newQuestion1(),
    "question2" : newQuestion2(),
    "question3" : newQuestion3(),
    "question4" : newQuestion4(),
    "question5" : newQuestion1()
  }
}
}
export default class Quiz extends Component {
  constructor(props){
    super(props);
    this.qno = 0
    this.score = 0

    const jdata = jsonData.quiz.quiz1
    arrnew = Object.keys(jdata).map( function(k) { return jdata[k] });
    this.state = {
      question : arrnew[this.qno].question,
      options : arrnew[this.qno].options,
      correctoption : arrnew[this.qno].correctoption,
      countCheck : 0,
      status: false
    }

  }
  prev(){
    if(this.qno > 0){
      this.qno--
      this.setState({ question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption : arrnew[this.qno].correctoption})
    }
  }
  next(){
    if(this.qno < arrnew.length-1){
      this.qno++
      this.setState({ countCheck: 0, question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption : arrnew[this.qno].correctoption , status : false})
    }else{
      this.props.quizFinish(this.score*100/5)
     }
  }
  _answer(status,ans){

    if(status == true){
        const count = this.state.countCheck + 1;
        this.setState({ countCheck: count })
        if(ans == this.state.correctoption ){
          this.score += 1
          Alert.alert("Good Job! You got it correct");
        }
        else{
        const count = this.state.countCheck - 1;
        this.setState({ countCheck: count })
        if(this.state.countCheck < 1 || ans == this.state.correctoption){
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
    const options = Object.keys(currentOptions).map( function(k) {
      return ( <View key={k} style={{margin:10}}>

        <Animbutton  status = {status} countCheck={_this.state.countCheck} onColor={"green"} effect={"tada"} _onPress={(status) => _this._answer(status,k)} text={currentOptions[k]} />

      </View>)
    });

    return (
      <ScrollView style={{backgroundColor: '#F5FCFF',paddingTop: 10}}>
      <View style={styles.container}>

      <View style={{ flex: 1,flexDirection: 'column', justifyContent: "space-between", alignItems: 'center',}}>

      <View style={styles.oval} >
        <Text style={styles.welcome}>
          {this.state.question}
        </Text>
     </View>
        <View>
        { options }
        </View>
        <View style={{flexDirection:"row"}}>
         <Button
          onPress={() => this.next()}
          title="Next"
          color="green"
        />
        
        <View style={{margin:15}} />

        {/*<TouchableOpacity onPress={() => this.next()} >
          <View style={{paddingTop: 5,paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius:10, backgroundColor:"green"}}>
            <Icon name="" size={30} color="white" />
          </View>
    
        </TouchableOpacity >*/}

        </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  oval: {
  width: width * 90/100,
  borderRadius: 20,
  backgroundColor: 'green'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    margin: 15,
    color: "white"
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});