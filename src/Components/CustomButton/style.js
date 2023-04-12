import {StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: width * 0.05,
  },
  BasicButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.03,
    borderWidth: 1.25,
    width: width * 0.9,
    padding: width * 0.045,
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  CustomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.03,
    width: width * 0.9,
    padding: width * 0.045,
    backgroundColor: colors.secondaryGreen,
  },
  BasicButtonText: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  CustomButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    color: colors.black,
  },
  iconStyle: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'cover',
    marginRight: width * 0.05,
  },
});
