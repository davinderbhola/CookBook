import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Colors1, Colors3, font } from '../../constants/Theam';
import SafeScreen from '../../components/SafeScreen';
import Cartegories from '../../components/Cartegories';
import {
  HorizontalScale,
  moderateFontSize,
  VerticalScale,
} from '../../constants/Responsive';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import RecipeCard from '../../components/RecipeCard';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [ActiveCatagory, setActiveCatagory] = useState('Chicken');
  const navigation = useNavigation()

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{
          paddingHorizontal: HorizontalScale(3.5),
          paddingTop: VerticalScale(1),
        }}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.profile}>
            <Image
              source={require('../../assets/images/human.png')}
              style={{ width: '150%', height: '150%', objectFit: 'contain' }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bell}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        {/* Section 1 */}
        <View style={styles.content}>
          <Text
            style={{
              fontSize: moderateFontSize(16),
              fontFamily: font.fonarto,
              // fontFamily: font.Montavie,
              color: Colors3.gray,
            }}
          >
            Hello, Davinder
          </Text>
          <Text
            style={{
              fontSize: moderateFontSize(22),
              // fontFamily: font.Montavie,
              fontFamily: font.fonarto,
              // letterSpacing: 1.5,
              color: Colors3.gray,
              textTransform: 'capitalize',
            }}
          >
            Make your own food, stay at{' '}
            <Text style={{ color: Colors3.accent }}>Home</Text>
          </Text>
        </View>
        {/* Search Bar */}
        <View style={styles.contaner2}>
          <TextInput
            placeholder="Search any recipe"
            placeholderTextColor={Colors3.gray}
            style={styles.input1}
          />
          <TouchableOpacity style={styles.serchBtn}>
            <MagnifyingGlassIcon
              color={Colors3.textPrimary}
              width={20}
              height={20}
            />
          </TouchableOpacity>
        </View>
        {/* Catagoure Section */}
        <View>
          <Cartegories
            activeCatagory={ActiveCatagory}
            setActiveCatagory={setActiveCatagory}
          />
        </View>
        {/* Resipes */}
        <View>
          <RecipeCard activeCatagory={ActiveCatagory} navigation={navigation}/>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: VerticalScale(6.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: VerticalScale(1),
  },
  profile: {
    padding: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: Colors1.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    // backgroundColor: Colors1.light,
    paddingHorizontal: HorizontalScale(2.5),
    paddingVertical: VerticalScale(1.5),
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: VerticalScale(0.7),
    marginBottom: VerticalScale(1),
  },
  contaner2: {
    width: '100%',
    height: VerticalScale(5.8),
    borderWidth: 0.3,
    borderColor: Colors3.gray,
    backgroundColor: '#e5e5e54d',
    borderRadius: 100,
    flexDirection: 'row',
    paddingHorizontal: HorizontalScale(3),
    paddingVertical: VerticalScale(0.5),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: VerticalScale(2.5),
  },
  input1: {
    width: '85%',
    fontSize: HorizontalScale(4),
    color: Colors3.gray,
  },
  serchBtn: {
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
});
