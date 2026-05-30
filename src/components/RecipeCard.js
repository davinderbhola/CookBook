import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  HorizontalScale,
  moderateFontSize,
  VerticalScale,
} from '../constants/Responsive';
import { Colors1, Colors3, font } from '../constants/Theam';
import { categouries } from '../constants/Enum';
import { FlashList } from '@shopify/flash-list';
import { getRecipesByCategory } from '../api/api';
import Animated, { FadeInUp } from 'react-native-reanimated';
import CachedImage from '../helper/image';
import { NavigationScreens } from '../constants/Strings';
import { useNavigation } from '@react-navigation/native';

export const Recipe = ({ item, index }) => {
  let isEven = index % 2 == 0;
  let isHight = index % 3 == 0;
  let images = item?.image;
  const fonts = [font.rust, font.Montavie];

  const navigation = useNavigation();

  const currentFont = fonts[index % fonts.length];
  return (
    <Animated.View
      entering={FadeInUp.delay(50).duration(400)}
      style={{ width: '100%' }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          justifyContent: 'center',
          marginBottom: VerticalScale(2),
        }}
        onPress={() => {
          navigation.navigate(NavigationScreens.RecipeDetailsScreen, {...item});
        }}
      >
        <CachedImage
          source={{ uri: images }}
          style={{
            width: '100%',
            height: isHight ? VerticalScale(25) : VerticalScale(35),
            borderRadius: 30,
            backgroundColor: '#d0d0d0',
          }}
          resizeMode="cover"
        />
        <View
          style={{
            paddingVertical: VerticalScale(0.5),
            paddingHorizontal: HorizontalScale(3),
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontFamily: font.fonarto,
              color: Colors3.textSecondary,
              fontSize: HorizontalScale(3.6),
            }}
          >
            {item?.name.length > 20
              ? item?.name.slice(0, 20) + '....'
              : item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RecipeCard = ({ activeCatagory }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, [activeCatagory]);

  const loadRecipes = async () => {
    setLoading(true);
    const data = await getRecipesByCategory(activeCatagory);
    setRecipes(data);
    setLoading(false);
  };
  return (
    <View
      style={{
        width: '100%',
        paddingVertical: VerticalScale(3),
      }}
    >
      <Text
        style={{
          fontSize: moderateFontSize(22),
          color: Colors3.gray,
          fontFamily: font.fonarto,
        }}
      >
        Recipes
      </Text>

      <View style={{ marginTop: VerticalScale(2) }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors1.primary}
            style={{ marginTop: VerticalScale(10) }}
          />
        ) : (
          <View style={{ marginTop: VerticalScale(2) }}>
            <FlashList
              key={activeCatagory}
              data={recipes}
              renderItem={({ item, index }) => (
                <View style={{ paddingHorizontal: HorizontalScale(3) }}>
                  <Recipe item={item} index={index} />
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={2}
              masonry
              estimatedItemSize={200}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default RecipeCard;
