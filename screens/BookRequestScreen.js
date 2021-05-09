import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView, TouchableHighlight } from "react-native";
import {BookSearch} from 'react-native-google-books';
import firebase from "firebase";
import db from "../Config";
import MyHeader from "../components/MyHeader";
import { FlatList } from "react-native-gesture-handler";

export default class BookRequestScreen extends Component {
  constructor(){
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonForRequest: "",
      requestId:"",
      requestedBookName:"",
      bookStatus:"",
      userDocId:"",
      docId:"",
      isBookRequestActive:"",
      showFlatlist: false,
      dataSource: "",
      imageLink: ""
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  
  addRequest = async (bookName, reasonForRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(bookName, "AIzaSyCH0kZgtREj_CgyD4YwdM2VnxPZLS_JT3A");
    db.collection("bookRequests").add({
      user_id: userId,
      book_name: bookName,
      reason_for_request: reasonForRequest,
      request_id: randomRequestId,
      image_link: books.data[0].volumeInfo.imageLinks.smallThumbnail,
      book_status: 'requested',
      date:firebase.firestore.FieldValue.serverTimestamp()
    });
    await this.getBookRequest();
    db.collection("users").where("email_id", "==", userId).get()
    .then()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        db.collection("users").doc(doc.id).update({isBookRequestActive: true})
      })
    });
    this.setState({ bookName: "", reasonForRequest: "", requestId:randomRequestId });
    return Alert.alert("Book requested successfully");
  }

  getBookRequest = ()=>{
    var bookRequest = db.collection("bookRequests").where("user_id", "==", this.state.userId)
    .get().then(snapshot=>{
      snapshot.forEach(doc=>{
        if(doc.data().book_status!=="received"){
          this.setState({
            requestId:doc.data().request_id,
            requestedBookName:doc.data().book_name,
            bookStatus:doc.data().book_status,
            docId:doc.id
          })
        }
      });
    });
  }

  receivedBooks = (bookName) =>{
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      user_id:userId,
      book_name:bookName,
      request_id:requestId,
      bookStatus:"received"
    });
  }

  getIsBookRequestActive = ()=>{
    db.collection("users").where("email_id", "==", this.state.userId)
    .onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          userDocId:doc.id
        });
      });
    });
  }

  sendNotification = ()=>{
    db.collection("users").where("email_id", "==", this.state.userId)
    .get().then(snapshot=>{
      snapshot.forEach(doc=>{
        var name = doc.data().first_name;
        var lastName = doc.data().last_name;
        db.collection("all_notifications").where("request_id", "==", this.state.requestId)
        .get().then(snapshot=>{
          snapshot.forEach(doc=>{
            var donorId = doc.data().donor_id;
            var bookName = doc.data().book_name;
            db.collection("all_notifications").add({
              targeted_user_id: donorId,
              message: name + " " + lastName + "received the book" + bookName + ".",
              notification_status: "unread",
              book_name: bookName
            });
          });
        });
      });
    });
  }

  updateBookRequestStatus = ()=>{
    db.collection("bookRequests").doc(this.state.docId).update({
      book_status: "received"
    });
    db.collection("users").where("email_id", "==", this.state.userId)
    .get().then(snapshot=>{
      snapshot.forEach(doc=>{
        db.collection("users").doc(doc.id).update({
          isBookRequestActive: false
        });
      })
    })
  }

  async getBooksFromAPI(bookName){
    this.setState({bookName: bookName});
    if (bookName.length > 2){
      var books = await BookSearch.searchbook(bookName, "AIzaSyCH0kZgtREj_CgyD4YwdM2VnxPZLS_JT3A");
      this.setState({dataSource: books.data, showFlatlist: true});
    }
  }

  renderItem = ({item, i})=>{
    console.log(item);
    return (
      <TouchableHighlight
      style = {{alignItems: "center", backgroundColor: "#DDDDDD", padding: 10, width: '90%'}}
      activeOpacity = {0.6}
      underlayColor= "#DDDDDD"
      onPress = {()=>{
        this.setState({showFlatlist: false, bookName: item.volumeInfo.title});
      }}
      bottomDivider>
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    );
  }

  componentDidMount(){
    this.getBookRequest();
    this.getIsBookRequestActive();
    // var books = BookSearch.searchbook('Harry Potter', "AIzaSyCH0kZgtREj_CgyD4YwdM2VnxPZLS_JT3A");
    // console.log(books);
  }

  render() {
    if(this.state.isBookRequestActive===true){
      return (
        <View style={{flex:1, justifyContent: "center"}}>
          <View style={{borderColor:"orange", borderWidth: 2, justifyContent: "center", alignItems: "center", padding: 10, margin:10}}>
            <Text>Book Name:</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor:"orange", borderWidth: 2, justifyContent: "center", alignItems: "center", padding: 10, margin:10}}>
            <Text>Book Status: {this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            style = {{
              borderWidth:1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              marginTop: 30,
              height: 30
            }}
            onPress = {()=>{
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}>
            <Text>I received the book</Text>
          </TouchableOpacity>
        </View>
      ); 
    }
    else{
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation}/>
          <View>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter Book Name"
              onChangeText={(text) => {this.getBooksFromAPI(text)}}
              onClear={(text) => {this.getBooksFromAPI("")}}
              value={this.state.bookName}
            />
            {this.state.showFlatlist?(
              <FlatList
              data = {this.state.dataSource}
              renderItem = {this.renderItem}
              enableEmptySections = {true}
              style = {{marginTop: 10}}
              keyExtractor = {(item, index)=>{index.toString()}}/>
              ):(
                <View style = {{alignItems: "center"}}>
                  <TextInput
                    style={[styles.formTextInput, { height: 300 }]}
                    placeholder="Enter Reason"
                    onChangeText={(text) => {
                      this.setState({ reasonForRequest: text });
                    }}
                    multiline
                    numberOfLines={5}
                    value={this.state.reasonForRequest}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.addRequest(this.state.bookName, this.state.reasonForRequest);
                    }}
                  >
                    <Text>SUBMIT</Text>
                  </TouchableOpacity>
                </View>
            )}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
