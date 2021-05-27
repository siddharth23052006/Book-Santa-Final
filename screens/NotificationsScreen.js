import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text,  TouchableOpacity, Alert, Modal, KeyboardAvoidingView, FlatList } from "react-native";
import firebase from "firebase";
import db from "../Config";
import { Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import SwipeableFlatList from "../components/SwipeableFlatList";

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props); //added
    this.state = {
      userID: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, index }) => {
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  getNotifications = () => {
    this.requestRef = db
      .collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({ allNotifications: allNotifications });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    //this.notificationRef = null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title={"Notifications"}
            navigation={this.props.navigation}
          />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotifications.length === 0 ? ( //changed(removed curly closing and added it on 89)
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>You have no notifications.</Text>
            </View>
          ) : (
            //<FlatList
              //keyExtractor={this.keyExtractor}
              //data={this.state.allNotifications}
              //renderItem={this.renderItem}
              ///>
            <SwipeableFlatList allNotifications={this.state.allNotifications}/>
          )}
        </View>
      </View>
    );
  }
}