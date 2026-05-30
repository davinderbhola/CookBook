import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import { GlobalStyles } from '../../GlobalStyle';
import { Colors1, Colors2, Colors3, font } from '../../constants/Theam';
import {
  HorizontalScale,
  moderateFontSize,
  VerticalScale,
} from '../../constants/Responsive';
import { NavigationScreens, StringTxt } from '../../constants/Strings';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {
  const scale = useSharedValue(0.1);
  const textTranslateY = useSharedValue(70); // start below the screen
  const textOpacity = useSharedValue(0); // invisible start

  const navigation = useNavigation();

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });

    textTranslateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });

    textOpacity.value = withTiming(1, {
      duration: 1000,
    });

    setTimeout(() => {
      navigation.replace(NavigationScreens.HomeScreen);
    }, 2000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: textTranslateY.value }],
      opacity: textOpacity.value,
    };
  });

  return (
    <View
      style={[GlobalStyles.container, GlobalStyles.center, styles.contain1]}
    >
      <Animated.View
        style={[
          {
            width: HorizontalScale(100),
            height: HorizontalScale(100),
            borderRadius: HorizontalScale(100),
          },
          animatedStyle,
        ]}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: VerticalScale(10),
          },
          textAnimatedStyle,
        ]}
      >
        <Text
          style={{
            fontSize: moderateFontSize(26),
            fontFamily: font.rust,
            color: Colors3.textPrimary,
            fontWeight: '600',
          }}
        >
          Good Food, <Text style={{ color: Colors1.primary }}>Good Mood</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  contain1: {
    backgroundColor: Colors1.light,
    position: 'relative',
    paddingVertical: HorizontalScale(10),
  },
});
