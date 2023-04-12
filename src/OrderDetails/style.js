import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderDetailsHeadText: {
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    color: colors.primaryGreen,
    marginBottom: 10,
  },
  orderDetailsText: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    color: colors.placeholder,
    marginBottom: 10,
  },
});
