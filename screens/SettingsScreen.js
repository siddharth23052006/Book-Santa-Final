import React, { Component } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView, FlatList } from "react-native";
import { Input } from "react-native-elements";
import firebase from "firebase";
import db from "../Config";
import MyHeader from "../components/MyHeader";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailID: "",
      address: "",
      first_name: "",
      last_name: "",
      contact: "",
      docID: "",
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailID: data.email_id,
            first_name: data.first_name,
            last_name: data.last_name,
            address: data.address,
            contact: data.contact,
            docID: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docID).update({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      address: this.state.address,
      contact: this.state.contact,
    });
    Alert.alert("Profile updated successfully!");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <View style={styles.formContainer}>
          {/*<TextInput
            style={styles.formTextInput}
            placeholder="First Name"
            onChangeText={(text) => {
              this.setState({ first_name: text });
            }}
            maxLength={15}
            value={this.state.first_name}
          />*/}
          <Input
          style = {styles.formTextInput}
          placeholder = {"First Name"}
          label = "First Name"
          onChangeText = {text=>{
            this.setState({first_name: text});
          }}
          maxLength = {15}
          value = {this.state.first_name}
          containerStyle = {{marginBottom:RFValue(25), marginTop:RFValue(35)}}/>

          <TextInput
            style={styles.formTextInput}
            placeholder="Last Name"
            onChangeText={(text) => {
              this.setState({ last_name: text });
            }}
            maxLength={20}
            value={this.state.last_name}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Contact"
            onChangeText={(number) => {
              this.setState({ contact: number });
            }}
            maxLength={10}
            keyboardType="numeric"
            value={this.state.contact}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Address"
            onChangeText={(text) => {
              this.setState({ address: text });
            }}
            multiline={true}
            value={this.state.address}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.buttonText}>Save Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
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
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
