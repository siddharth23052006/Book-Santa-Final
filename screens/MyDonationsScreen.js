import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, FlatList } from "react-native";
import firebase from "firebase";
import db from "../Config";
import { Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader";

export default class MyDonationsScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: "",
    };
    this.requestRef = null;
  }

  getDonorDetails = (donorID) => {
    db.collection("users")
      .where("email_id", "==", donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donations")
      .where("donor_id", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        var allDonations = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };

  sendNotification = (bookDetails, requestStatus) => {
    var requestID = bookDetails.request_id;
    var donorID = bookDetails.donor_id;
    db.collection("all_notifications")
      .where("request_id", "==", requestID)
      .where("donor_id", "==", donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("inside sendNotification snapshot");
          var message = "";
          if (requestStatus === "Book Sent") {
            message = this.state.donorName + " sent you a book.";
          } else {
            message =
              this.state.donorName +
              " has shown interest in donating the book.";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendBook = (bookDetails) => {
    console.log(bookDetails);
    if (bookDetails.request_status === "Book Sent") {
      console.log("inside sendBook if");
      var requestStatus = "Donor Interested";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: requestStatus,
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      console.log("inside sendBook else");
      var requestStatus = "Book Sent";
      console.log("docid : " + bookDetails.doc_id);
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: requestStatus,
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

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
            Requested by: {item.requested_by}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ color: "green" }}>
            status: {item.request_status}
          </ListItem.Subtitle>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "Book Sent" ? "green" : "#ff5722",
              },
            ]}
            onPress={() => {
              this.sendBook(item);
            }}
          >
            <Text style={{ color: "#ffff" }}>
              {item.request_status === "Donor Interested"
                ? "Send Book"
                : "Book Sent"}
            </Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.userID);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of All Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    color: "red",
    alignItems: "center",
    alignContent: "center",
  },
  subtitle: {
    fontSize: 20,
  },
});
