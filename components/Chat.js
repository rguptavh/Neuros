import * as firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';



class Chat extends Component {
  static navigationOptions = {
    
    title: 'Ask a Question!',
  };  // 3.
  state = {
    messages: [],
  };
// 1.
componentDidMount() {
  this.on(message =>
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message),
    }))
  );
}// 2.
componentWillUnmount() {
  this.off();
}

get user() {  // Return our name and our UID for GiftedChat to parse
  return {
    avatar:'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg',
    name:global.firstname + " " + global.lastname, 

    _id: this.uid,

  };
}

  get ref() {
    return firebase.database().ref('messages');
  }// 2.
  on = callback =>
      this.ref
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)));// 3.
  off() {
    this.ref.off();
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  parse = snapshot => { 
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;  
    const message = {
      _id,
      text,
      user,
      createdAt: new Date()
    };
   return message;
  };

send = messages => {
  console.log(messages)
  for (let i = 0; i < messages.length; i++) {
    const { text, user, createdAt } = messages[i];
    const message = {
      text,
      user,
      createdAt,
    };
    this.append(message);
  }
  const { text, user, createdAt } = messages[0];
    const message = {
      text,
      user,
      createdAt,
    };
    message.user.name = "John Smith"
    message.user._id = 'eNaTNBAPPFYlMnrP1FZjiNwNEUC3'
    message.text = 'I really like the quiz feature!'
    setTimeout(() => {this.append(message);}, 1000)
};// 5.
append = message => this.ref.push(message);
render() {
  return (
    <GiftedChat
      renderUsernameOnMessage={true}
      messages={this.state.messages}
      onSend={this.send}

      user={this.user}
    />
  );
}
}const styles = StyleSheet.create({});export default Chat;