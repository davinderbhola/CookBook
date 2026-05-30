import { StyleSheet } from 'react-native';
import { Colors2 } from '../src/constants/Theam';
import {
  HorizontalScale,
  VerticalScale,
  moderateFontSize,
} from '../src/constants/Responsive';

export const GlobalStyles = StyleSheet.create({
  // 🌍 Common containers
  container: {
    flex: 1,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 📝 Text styles
  heading: {
    fontSize: moderateFontSize(20),
    fontWeight: '600',
    color: Colors2.textPrimary,
  },

  text: {
    fontSize: moderateFontSize(14),
    color: Colors2.textSecondary,
  },

  card: {
    backgroundColor: Colors2.border,
    borderRadius: HorizontalScale(4),
    padding: HorizontalScale(4),
    marginVertical: VerticalScale(1),
  },
});
