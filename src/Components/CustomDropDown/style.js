import {StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.25,
  },
  customTextInput: {
    width: width * 0.8,
    padding: width * 0.05,
    color: colors.primaryGreen,
    fontFamily: 'Lato-Regular',
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginRight: 15,
  },
});
