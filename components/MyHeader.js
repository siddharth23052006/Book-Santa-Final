import React, {Component} from 'react';
import {View} from 'react-native';
import {Header, Icon, Badge} from 'react-native-elements';
import db from '../Config';

export default class MyHeader extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: ''
    }
  }

  getNumberOfUnreadNotifications = ()=>{
    db.collection('all_notifications').where("notification_status", "==", "unread")
    .onSnapshot(snapshot=>{
      var unreadNotifications = snapshot.docs.map(doc=>doc.data());
      this.setState({value:unreadNotifications.length});
    });
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge = props =>{
    return(
      <View>
        <Icon name="bell" type="font-awesome" color="red" size={25} onPress={()=>{props.navigation.navigate('MyNotifications')}}/>
        <Badge value={this.state.value} containerStyle={{position: 'absolute', top: -4, right: -4}}/>
      </View>
    );
  }

  render(){
    return(
      <Header
        leftComponent = {<Icon name="bars" type="font-awesome" color="red" onPress={()=>{this.props.navigation.toggleDrawer()}}/>}
        centerComponent = {{text: this.props.title, style:{
          color:'#FF0000', fontSize:20, fontWeight:'bold'
        }}}
        rightComponent = {<this.BellIconWithBadge {...this.props}/>}
        backgroundColor = '#EAF8FE'
      />
    );
  }
}