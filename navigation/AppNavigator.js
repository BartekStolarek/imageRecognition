import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import PhotoScreen from '../screens/PhotoScreen';

// const PhotoStack = createStackNavigator({
//   Photo: PhotoScreen
// });

export default createSwitchNavigator({
  Main: MainTabNavigator,
  Photo: PhotoScreen
});