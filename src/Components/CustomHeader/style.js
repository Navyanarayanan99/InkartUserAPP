import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
