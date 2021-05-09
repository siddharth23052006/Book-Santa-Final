import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text,  TouchableOpacity, Alert, Modal, KeyboardAvoidingView, FlatList } from "react-native";
import firebase from "firebase";
import db from "../Config";
import { Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader";

export default class MyReceivedBooksScreen extends Component{
  constructor(){
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      receivedBooksList: []
    }
    this.requestRef = null;
  }

  getReceivedBooksList = ()=>{
    this.requestRef = db.collection("received_books").where("user_id", "==", this.state.userId).where("bookStatus", "==", "received")
    .onSnapshot(snapshot=>{
        var receivedBooksList = snapshot.docs.map(doc=>doc.data());
        this.setState({receivedBooksList:receivedBooksList});
    });
  }

  componentDidMount(){
    this.getReceivedBooksList();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>

          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {" "}
            {item.book_name}
          </ListItem.Title>

          <ListItem.Subtitle style={{ color: "green" }}>
            {item.bookStatus}
          </ListItem.Subtitle>
          
        </ListItem.Content>
      </ListItem>   
    );
  }

  render(){
    return(
      <View style = {{flex:1}}>
        <MyHeader title = "Received Books" navigation = {this.props.navigation}/>
        <View style = {{flex:1}}>
          {this.state.receivedBooksList.length===0?(
            <View>
              <Text style={{fontSize:25}}>No books received till now.</Text>
            </View>
          ):(
            <FlatList
            data = {this.state.receivedBooksList}
            renderItem = {this.renderItem}
            keyExtractor = {this.keyExtractor}/>
          )}
          
        </View>
      </View>
      
    );
  }
}