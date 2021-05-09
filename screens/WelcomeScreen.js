import * as React from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView } from "react-native";
import firebase from "firebase";
import BookAnimation from "../components/BookSanta";
import db from "../Config";
import {Input, Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      address: "",
      contactNo: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      isModalVisible: false,
    };
  }

  userLogin = async (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.props.navigation.navigate("DonateBooks");
        Alert.alert("Successfully Logged in");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert(errorMessage);
      });
  };

  userSignup = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Passwords do not match \n Check your Password");
    } else {
      console.log("SignIn");
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contactNo,
            email_id: this.state.email,
            address: this.state.address,
            isBookRequestActive: false
          });
          return Alert.alert("User added successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>

              <Input
                style={styles.formTextInput}
                placeholder="First Name"
                label = "First Name"
                onChangeText={(text) => {
                  this.setState({ firstName: text });
                }}
                maxLength={15}
              />

              <Input
                style={styles.formTextInput}
                placeholder="Last Name"
                label = "Last Name"
                onChangeText={(text) => {
                  this.setState({ lastName: text });
                }}
                maxLength={20}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Contact"
                onChangeText={(number) => {
                  this.setState({ contactNo: number });
                }}
                maxLength={10}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Address"
                onChangeText={(text) => {
                  this.setState({ address: text });
                }}
                multiline={true}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="example@abcd.com"
                onChangeText={(text) => {
                  this.setState({ email: text });
                }}
                keyboardType="email-address"
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Enter Password"
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
                secureTextEntry={true}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Confirm Password"
                onChangeText={(text) => {
                  this.setState({ confirmPassword: text });
                }}
                secureTextEntry={true}
              />

              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.userSignup(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBackButton}>
                {/*<TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({ isModalVisible: false });
                  }}
                >
                  <Text style={styles.registerButtonText}>Cancel</Text>
                </TouchableOpacity>*/}
                <Icon
                name = {"cancel"}
                type  = {"materialicons"}
                size = {RFValue(40)}
                color = {"red"}
                onPress={() => {
                    this.setState({ isModalVisible: false });
                  }}/>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.showModal()}
        </View>
        <View style={styles.profileContainer}>
          <BookAnimation />
          <Text style={styles.title}>Book Santa</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TextInput
            placeholder="example@abcd.com"
            style={styles.loginBox}
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Enter Password"
            style={styles.loginBox}
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
            onPress={() => {
              this.userLogin(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8BE85",
    alignItems: "center",
    justifyContent: "center",
  },

  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 65,
    fontWeight: "300",
    paddingBottom: 30,
    color: "#ff3d00",
  },

  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: "#ff8a65",
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },

  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "#ff5722",
    margin: 50,
  },

  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
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

  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },

  registerButtonText: {
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },

  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  button: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#ff9800",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    padding: 10,
  },

  buttonText: {
    color: "#ffff",
    fontWeight: "200",
    fontSize: 20,
  },
});
