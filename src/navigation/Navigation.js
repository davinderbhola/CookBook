import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen, LandingScreen , RecipeDetailScreen} from '../screens';
import { NavigationScreens } from '../constants/Strings';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={NavigationScreens.LandingScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={NavigationScreens.LandingScreen}
          component={LandingScreen}
        />
        <Stack.Screen
          name={NavigationScreens.HomeScreen}
          component={HomeScreen}
        />
        <Stack.Screen
          name={NavigationScreens.RecipeDetailsScreen}
          component={RecipeDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
