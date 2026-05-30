import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { categouries } from '../constants/Enum';
import { HorizontalScale, moderateFontSize } from '../constants/Responsive';
import { Colors1, Colors2, Colors3, font } from '../constants/Theam';
import { getCategories } from '../api/api';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CachedImage from '../helper/image';

const Cartegories = ({ activeCatagory, setActiveCatagory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    // console.log('Categories Data', data);
    setCategories(data);
    setLoading(false);
  };

  if (loading) {
    return (
      // <View
      //   style={{
      //     width: '100%',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     paddingVertical: HorizontalScale(7),
      //   }}
      // >
      //   {/* <ActivityIndicator size={'large'} color={Colors3.accent} /> */}
      // </View>
      null
    );
  }

  return (
    <Animated.View
      key={categories.length}
      entering={FadeInDown.duration(500).springify()}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((item, index) => {
          const isActive = item?.strCategory === activeCatagory;
          let activeBtnStyle = isActive
            ? {
                backgroundColor: Colors3.accent,
                borderRadius: 100,
                padding: HorizontalScale(1),
              }
            : {};
          let activeBorderStyle = isActive
            ? {
                borderColor: Colors3.accent,
                paddingBottom: HorizontalScale(0.9),
                borderBottomWidth: 2,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              }
            : {};
          return (
            <TouchableOpacity
              key={index}
              style={[styles.touchable, activeBorderStyle]}
              onPress={() => setActiveCatagory(item?.strCategory)}
            >
              <View style={[styles.imageContainer, activeBtnStyle]}>
                <CachedImage
                  source={{ uri: item?.strCategoryThumb }}
                  style={styles.image}
                />
              </View>
              <Text
                style={{
                  fontSize: HorizontalScale(4),
                  fontFamily: font.Montavie,
                }}
              >
                {item?.strCategory}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default Cartegories;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 14,
  },

  touchable: {
    alignItems: 'center',
    marginRight: HorizontalScale(5),
    gap: HorizontalScale(0.9),
  },

  imageContainer: {
    width: HorizontalScale(18),
    height: HorizontalScale(18),
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    objectFit: 'cover',
  },
});
