// In App.js in a new project
import React from 'react';
import WatchVideo from './app/views/WatchVideo';
import BookmarkList from './app/views/BookmarkList';
import HomeView from './app/views/Home';
import PhoneSignup from './app/views/PhoneSignup';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Ionicons from 'react-native-vector-icons/Ionicons'

const AppNavigator = createStackNavigator({
   A: {
     screen: createBottomTabNavigator({
       Home: HomeView,
       List: BookmarkList,
       Signup: PhoneSignup,
     },{
       defaultNavigationOptions: ({ navigation }) => ({
         tabBarIcon: ({ focused, horizontal, tintColor }) => {
           const { routeName } = navigation.state;
           let IconComponent = Ionicons;
           let iconName;
           if (routeName === 'Watch') {
             iconName = `logo-youtube`;
             // Sometimes we want to add badges to some icons.
             // You can check the implementation below.
             // IconComponent = HomeIconWithBadge;
           } else if (routeName === 'Settings') {
             iconName = `ios-settings`;
           }

           // You can return any component that you like here!
           return <IconComponent name={iconName} size={25} color={tintColor} />;
         },
       }),
       tabBarOptions: {
         activeTintColor: 'blue',
         inactiveTintColor: 'gray',
       },
     })
   },
   video: {
     screen: WatchVideo
   }
 },
   {
    initialRouteName: 'A',
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);
