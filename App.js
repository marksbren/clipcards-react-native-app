// In App.js in a new project
import React from 'react';
import WatchVideo from './app/views/WatchVideo';
import PhoneSignup from './app/views/PhoneSignup';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'



const AppNavigator = createBottomTabNavigator({
  Watch: WatchVideo,
  Signup: PhoneSignup,
  Settings: WatchVideo,
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
}

);

export default createAppContainer(AppNavigator);
