import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../common/colors';

const {width} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  titleText: {
    fontFamily: 'Lato-Black',
    fontSize: 22,
    textAlign: 'center',
    color: colors.black,
    marginTop: 25,
  },
  commonMargin: {margin: 10},
  image: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    right: 15,
    bottom: 0,
    position: 'absolute',
  },
  iconImage: {
    width: 45,
    height: 45,
  },
  actionText: {
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionTouchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  actionTouchCamera: {
    borderRadius: 15,
    backgroundColor: colors.secondaryGreen,
    padding: 15,
    borderColor: colors.placeholder,
    borderWidth: 0.5,
  },
  actionTouchMedia: {
    borderRadius: 15,
    backgroundColor: colors.secondaryGreen,
    padding: 15,
    borderColor: colors.placeholder,
    borderWidth: 0.5,
  },
  actionTouchText: {fontFamily: 'Lato-Regular'},
  commonPadding: {padding: 15},
});
