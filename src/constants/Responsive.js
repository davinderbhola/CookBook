import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// Width based
export const HorizontalScale = value => {
  return wp(`${value}%`);
};

// Height based
export const VerticalScale = value => {
  return hp(`${value}%`);
};

// 🔤 Font scaling (BEST PRACTICE)
export const moderateFontSize = size => {
  return RFValue(size);
};
