import React,{Component} from 'react';
import {View, Text, Animated, Dimensions, StyleSheet, TouchableHighlight} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../Config';

export default class SwipeableFlatList extends Component{
  constructor(props){
    console.log('In Constructor')
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications
    }
    console.log(this.props.allNotifications);
  }

  updateMarkAsRead = notification=>{
    db.collection('all_notifications').doc(notification.doc_id).update({
      notification_status:"read"
    });
  }

  onSwipeValueChange = swipeData=>{
    var allNotifications = this.state.allNotifications;
    const {key, value} = swipeData;
    if (value<-Dimensions.get('window').width){
      const newData = [...allNotifications];
      this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({allNotifications:newData})
    }
  }

  renderItem = data=>(
    <Animated.View>
      <Text>Book Name: {data.item.book_name}</Text>
      <Text>Message: {data.item.message}</Text>
    </Animated.View>
  )

  renderHiddenItem = ()=>(
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Mark as Read</Text>
      </View>
    </View>
  )

  render(){
    return(
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data = {this.state.allNotifications}
          renderItem = {this.renderItem}
          renderHiddenItem = {this.renderHiddenItem}
          rightOpenValue = {-Dimensions.get('window').width}
          previewRowKey = {0}
          previewOpenValue = {-40}
          previewOpenDelay = {3000}
          onSwipeValueChange = {this.onSwipeValueChange}
          keyExtractor = {(item,index)=>index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start"
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#29b6f6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100
  },
  backRightBtnRight: {
    backgroundColor: "#29b6f6",
    right: 0
  }
});
