import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationView: {
    borderRadius: 12,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryGreen,
  },
  touchView: {
    borderRadius: 25,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.placeholder,
    borderWidth: 2,
  },
  addressSubText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: -5,
  },
  addressText: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: colors.black,
    marginBottom: -5,
  },
  locationImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginRight: 10,
  },
  imageView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  addressContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commonPadding: {paddingVertical: 20},
  currentLocText: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: -5,
  },
  paperPlaneImage: {
    width: 35,
    height: 35,
    resizeMode: 'cover',
    marginRight: 10,
  },
  addressTouch: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  addressView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    top: -5,
    padding: 20,
  },
  textInput: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.secondaryGreen,
  },
  description: {
    color: colors.primaryGreen,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  mapView: {
    height: height * 0.4,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
