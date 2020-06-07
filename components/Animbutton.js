import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';
export default class Animbutton extends Component {
  constructor(props) {
     super(props);
     this.state ={
       status: false
     }
   }
   _onPress(){
     console.log(this.state.status)
     this.props._onPress(!this.props.status)
     this.setState({ status: !this.props.status})
     switch (this.props.effect) {
       case 'bounce':
         this.refs.view.bounce(800)
         break;
       case 'flash':
         this.refs.view.flash(800)
         break;
       case 'jello':
         this.refs.view.jello(800)
         break;
       case 'pulse':
         this.refs.view.pulse(800)
         break;
       case 'rotate':
         this.refs.view.rotate(800)
         break;
       case 'rubberBand':
         this.refs.view.rubberBand(800)
         break;
       case 'shake':
         this.refs.view.shake(800)
         break;
       case 'swing':
         this.refs.view.swing(800)
         break;
       case 'tada':
         this.refs.view.tada(800)
         break;
       case 'wobble':
         this.refs.view.wobble(800)
         break;
     }
 
   }
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this._onPress()}>
        <Animatable.View ref="view" style={{ margin:10, paddingTop :10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: this.state.status ? this.props.onColor : "green", borderRadius:20}}>
          <Text style={{color: this.state.status ? "white" : "white", fontWeight: "bold"}}>{this.props.text}</Text>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }
}