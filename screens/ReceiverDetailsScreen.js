import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ListItem, Card } from "react-native-elements";
import firebase from "firebase";
import db from "../Config";
import MyHeader from "../components/MyHeader";

export default class ReceiverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      receiverID: this.props.navigation.getParam("details")["user_id"],
      requestID: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reasonForRequest: this.props.navigation.getParam("details")[
        "reason_for_request"
      ],
      receiverName: "",
      userName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverRequestDocID: "",
    };
  }

  getUserDetails = (userID) => {
    db.collection("users")
      .where("email_id", "==", userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  getReceiverDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.receiverID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().first_name,
            receiverContact: doc.data().contact,
            receiverAddress: doc.data().address,
          });
        });
      });
  }

  updateBookStatus = () => {
    db.collection("all_donations").add({
      book_name: this.state.bookName,
      request_id: this.state.requestID,
      requested_by: this.state.receiverName,
      donor_id: this.state.userID,
      request_status: "Donor Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + "has shown interest in donating the book.";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverID,
      donor_id: this.state.userID,
      request_id: this.state.requestID,
      book_name: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userID);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title="Receiver Details"
            navigation={this.props.navigation}
          />
        </View>

        <View style={{ flex: 0.3 }}>
          <Card title="Book Information" titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason: {this.state.reasonForRequest}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title="Receiver Information" titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
          {/*changed from style to styles here*/}
          <View style={styles.buttonContainer}>
            {this.state.receiverID !== this.state.userID ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.updateBookStatus();
                  this.addNotification();
                  this.props.navigation.navigate("MyDonations");
                }}
              >
                <Text>I want to donate</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
