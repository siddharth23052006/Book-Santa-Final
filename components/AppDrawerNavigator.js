import React, {Component} from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen'
import NotificationsScreen from '../screens/NotificationsScreen';
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
  Home:{
    screen:AppTabNavigator,
    navigationOptions:{
      drawerIcon: <Icon name = {"home"} type = "fontawesome5"/>
    }
  },
  MyDonations:{
    screen:MyDonationsScreen,
    navigationOptions:{
      drawerIcon: <Icon name = {"gift"} type = "font-awesome"/>
    }
  },
  MyNotifications:{
    screen:NotificationsScreen,
    navigationOptions:{
      drawerIcon: <Icon name = {"bell"} type = "font-awesome"/>
    }
  },
  Settings:{
    screen:SettingsScreen,
    navigationOptions:{
      drawerIcon: <Icon name = {"settings"} type = "feather"/>
    }
  },
  MyReceivedBooks:{
    screen:MyReceivedBooksScreen,
    navigationOptions:{
      drawerIcon: <Icon name = {"gift"} type = "font-awesome"/>
    }
  }
},
{
  contentComponent:CustomSideBarMenu
},
{
  initialRouteName:'Home'
});