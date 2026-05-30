import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { getRecipeDetailsById } from '../../api/api';
import { Colors1, Colors2, Colors3, font } from '../../constants/Theam';
import { WebView } from 'react-native-webview';
import {
  HorizontalScale,
  moderateFontSize,
  VerticalScale,
} from '../../constants/Responsive';
import CachedImage from '../../helper/image';
import SafeScreen from '../../components/SafeScreen';
import { ArrowLeftIcon, HeartIcon, hea } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { getRecipeDetail } from '../../api/api';

const RecipeDetailScreen = ({ route, items }) => {
  const item = route?.params;
  const [favourite, setFavourite] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  console.log('data : ', item);

  const [playing, setPlaying] = useState(false); // ← Video play state
  const [videoModal, setVideoModal] = useState(false); // ← Modal dikhega ya nahi
  const windowWidth = Dimensions.get('window').width;
  const youtubeVideoId = getYoutubeVideoId(recipeData?.strYoutube);

  useEffect(() => {
    loadData();
  }, [item]);

  const loadData = async () => {
    setLoading(true);
    const data = await getRecipeDetail(item?.id);
    setRecipeData(data);
    setLoading(false);
  };

  console.log('Compolete data : ', recipeData);

  // Helper function to smartly split instructions into steps
  const getInstructionSteps = instructions => {
    if (!instructions) return [];

    // Remove extra whitespace
    const clean = instructions.trim();

    // Check if already has STEP pattern (like "STEP 1", "Step 1", etc.)
    const hasStepPattern = /(?:STEP|Step)\s*\d+/i.test(clean);

    if (hasStepPattern) {
      // Split by STEP/Step followed by number
      return clean
        .split(/(?:STEP|Step)\s*\d+/i)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    // Check if has numbered list (1. 2. etc)
    const hasNumberedList = /^\s*\d+[\.)]\s+/m.test(clean);

    if (hasNumberedList) {
      return clean
        .split(/^\s*\d+[\.)]\s+/m)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    // Smart split: split by double newlines or sentences that look like steps
    // First try splitting by double newlines (paragraphs)
    const byParagraphs = clean
      .split(/\r?\n\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (byParagraphs.length > 1) {
      return byParagraphs;
    }

    // If single paragraph, try to split by sentences that indicate steps
    // Look for transition words or just split by periods followed by space
    const sentences = clean
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 15); // Only keep substantial sentences

    if (sentences.length > 1) {
      return sentences;
    }

    // Fallback: return as single step
    return [clean];
  };

  function getYoutubeVideoId(url) {
    if (!url) return null;

    // Different URL formats handle karega
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);

    return match && match[1] ? match[1] : null;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors3.accent2 }}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          width: '100%',
          height: VerticalScale(45),
        }}
      >
        <CachedImage
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 40,
            overflow: 'hidden',
          }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: VerticalScale(8),
          left: HorizontalScale(4),
          width: '92%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: VerticalScale(5),
            height: VerticalScale(5),
            borderRadius: 200,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeftIcon
            width={25}
            height={25}
            stroke={500}
            color={Colors3.accent}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: VerticalScale(5),
            height: VerticalScale(5),
            borderRadius: 200,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setFavourite(!favourite);
          }}
        >
          <HeartIcon
            width={30}
            height={30}
            stroke={500}
            color={favourite ? Colors1.red : '#a8a8a8'}
          />
        </TouchableOpacity>
      </View>

      {/* Meel Block Main */}

      {/* {loading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color={Colors1.primary} />
        </View>
      ) : (
        <View
          style={{
            flex:1,
            paddingHorizontal:HorizontalScale(6),
            marginTop:VerticalScale(4),
          }}
        >
          <View style={{paddingVertical:VerticalScale(1.5)}}>
            <Text>{recipeData?.strMeal}</Text>
          </View>
        </View>
      )} */}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors1.primary} />
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {/* Meal Name */}
          <Text style={styles.mealTitle}>{recipeData?.strMeal}</Text>

          {/* Category + Area Badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.badgeCategory]}>
              <Text style={styles.badgeIcon}>🍔</Text>
              <Text style={styles.badgeText}>{recipeData?.strCategory}</Text>
            </View>
            <View style={[styles.badge, styles.badgeArea]}>
              <Text style={styles.badgeIcon}>🌍</Text>
              <Text style={styles.badgeText}>{recipeData?.strArea}</Text>
            </View>
          </View>

          {/* Tags Row */}
          {recipeData?.strTags && (
            <View style={styles.tagsContainer}>
              {recipeData.strTags.split(',').map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {
                    Array.from(
                      { length: 20 },
                      (_, i) => recipeData[`strIngredient${i + 1}`],
                    ).filter(ing => ing && ing.trim() !== '').length
                  }{' '}
                  items
                </Text>
              </View>
            </View>

            <View style={styles.ingredientsGrid}>
              {Array.from({ length: 20 }, (_, index) => {
                const ingredient = recipeData[`strIngredient${index + 1}`];
                const measure = recipeData[`strMeasure${index + 1}`];
                if (!ingredient || ingredient.trim() === '') return null;

                return (
                  <View key={index} style={styles.ingredientCard}>
                    {/* <View style={styles.ingredientIconContainer}>
                <Text style={styles.ingredientEmoji}>
                  {['🥘','🧂','🥬','🍅','🧄','🧅','🌶️','🥕','🥩','🍗','🐟','🍤','🥛','🧈','🫒','🍋','🌿','🍚','🍝','🥫'][index] || '✨'}
                </Text>
              </View> */}
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName} numberOfLines={2}>
                        {ingredient}
                      </Text>
                      <Text style={styles.ingredientMeasure}>{measure}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* YouTube Link if available */}
          {/* YouTube Video Button */}
          <View style={styles.divider} />
          {recipeData?.strYoutube && youtubeVideoId && (
            <View style={{ padding: HorizontalScale(2) }}>
              <Text style={styles.sectionTitle}>Recipe Video</Text>
              <View
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginTop: VerticalScale(3),
                }}
              >
                <YoutubePlayer
                  height={HorizontalScale(50)}
                  width={'100%'}
                  videoId={youtubeVideoId}
                  play={playing}
                />
              </View>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {getInstructionSteps(recipeData?.strInstructions).length}{' '}
                  steps
                </Text>
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              {getInstructionSteps(recipeData?.strInstructions).map(
                (step, index) => (
                  <View key={index} style={styles.instructionStep}>
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepLabel}>Step {index + 1}</Text>
                      <Text style={styles.instructionText}>{step}</Text>
                    </View>
                  </View>
                ),
              )}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  // ========== LOADER ==========
  loaderContainer: {
    width: '100%',
    height: VerticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: moderateFontSize(14),
    color: '#999',
    fontFamily: font?.regular,
    letterSpacing: 0.5,
  },

  // ========== MAIN CONTAINER ==========
  contentContainer: {
    flex: 1,
    paddingHorizontal: HorizontalScale(5),
    marginTop: VerticalScale(2),
    paddingBottom: VerticalScale(5),
  },

  // ========== TITLE ==========
  mealTitle: {
    fontSize: moderateFontSize(25),
    fontFamily: font?.fonarto,
    color: Colors3.textSecondary,
    lineHeight: moderateFontSize(30),
    marginBottom: VerticalScale(2),
  },

  // ========== BADGES ==========
  badgeRow: {
    flexDirection: 'row',
    gap: HorizontalScale(2),
    marginBottom: VerticalScale(2),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HorizontalScale(3),
    paddingVertical: VerticalScale(1),
    borderRadius: 20,
    gap: 6,
  },
  badgeCategory: {
    backgroundColor: Colors1.primary + '18',
  },
  badgeArea: {
    backgroundColor: '#E8F5E9',
  },
  badgeIcon: {
    fontSize: moderateFontSize(14),
  },
  badgeText: {
    fontSize: moderateFontSize(12),
    color: Colors3.textSecondary,
    fontFamily: font?.fonarto,
    letterSpacing: 0.3,
  },

  // ========== TAGS ==========
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: VerticalScale(2),
  },
  tag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: HorizontalScale(2.5),
    paddingVertical: VerticalScale(0.6),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  tagText: {
    fontSize: moderateFontSize(11),
    color: '#E65100',
    fontFamily: font?.medium,
  },

  // ========== DIVIDER ==========
  divider: {
    height: VerticalScale(0.1),
    backgroundColor: '#a1a1a1',
    marginVertical: VerticalScale(2.5),
  },

  // ========== SECTION HEADER ==========
  section: {
    marginBottom: VerticalScale(1),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VerticalScale(2.5),
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: moderateFontSize(24),
    backgroundColor: Colors1.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: moderateFontSize(22),
    fontFamily: font?.bold,
    color: Colors1.primary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#ffe5c8a1',
    paddingHorizontal: HorizontalScale(2.5),
    paddingVertical: VerticalScale(0.6),
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: moderateFontSize(11),
    color: '#ff8000',
    fontFamily: font?.fonarto,
  },

  // ========== INGREDIENTS GRID ==========
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: HorizontalScale(2.5),
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: HorizontalScale(2.5),
    paddingVertical: VerticalScale(1.5),
    gap: 10,
    width: '47.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  ingredientIconContainer: {
    width: VerticalScale(4.5),
    height: VerticalScale(4.5),
    borderRadius: 14,
    backgroundColor: Colors3.accent2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientEmoji: {
    fontSize: moderateFontSize(18),
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: moderateFontSize(13),
    fontFamily: font?.semiBold,
    color: '#2D2D2D',
    lineHeight: moderateFontSize(18),
  },
  ingredientMeasure: {
    fontSize: moderateFontSize(11),
    color: '#888',
    fontFamily: font?.regular,
    marginTop: 2,
  },

  // ========== INSTRUCTIONS ==========
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: HorizontalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  instructionStep: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: VerticalScale(3),
  },
  stepNumberContainer: {
    width: VerticalScale(4),
    height: VerticalScale(4),
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: Colors1.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    shadowColor: Colors1.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: moderateFontSize(13),
    fontFamily: font?.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: moderateFontSize(12),
    fontFamily: font?.semiBold,
    color: Colors1.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  instructionText: {
    fontSize: moderateFontSize(15), // ← BIGGER TEXT
    lineHeight: moderateFontSize(24), // ← MORE LINE HEIGHT
    color: '#333', // ← DARKER for readability
    fontFamily: font?.regular,
    letterSpacing: 0.2,
  },

  // ========== YOUTUBE BUTTON ==========
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    marginTop: VerticalScale(3),
    marginHorizontal: HorizontalScale(2),
    paddingVertical: VerticalScale(2.2),
    borderRadius: 16,
    gap: 8,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  youtubeIcon: {
    fontSize: moderateFontSize(18),
  },
  youtubeText: {
    color: '#FFFFFF',
    fontSize: moderateFontSize(14),
    fontFamily: font?.semiBold,
    letterSpacing: 0.5,
  },

  // ========== YOUTUBE BUTTON ==========
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    marginTop: VerticalScale(3),
    marginHorizontal: HorizontalScale(2),
    paddingVertical: VerticalScale(2.2),
    borderRadius: 16,
    gap: 8,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  youtubeIcon: {
    fontSize: moderateFontSize(18),
  },
  youtubeText: {
    color: '#FFFFFF',
    fontSize: moderateFontSize(14),
    fontFamily: font?.semiBold,
    letterSpacing: 0.5,
  },

  // ========== MODAL STYLES ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: HorizontalScale(4),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    padding: HorizontalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VerticalScale(2),
  },
  modalTitle: {
    fontSize: moderateFontSize(18),
    fontFamily: font?.bold,
    color: Colors1.primary,
  },
  closeButton: {
    width: VerticalScale(4),
    height: VerticalScale(4),
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: moderateFontSize(16),
    color: '#666',
    fontFamily: font?.bold,
  },
  videoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  playPauseButton: {
    marginTop: VerticalScale(2),
    backgroundColor: Colors1.primary,
    paddingVertical: VerticalScale(1.5),
    borderRadius: 12,
    alignItems: 'center',
  },
  playPauseText: {
    color: '#FFFFFF',
    fontSize: moderateFontSize(14),
    fontFamily: font?.semiBold,
  },
});
