import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeScreen = ({ children , style}) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: 'white' }, style]}>
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;
