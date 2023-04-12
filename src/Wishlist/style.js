import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  trendingProView: {width: width, padding: 15},
  trendingProItemView: {
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    width: width * 0.9,
    margin: 15,
  },
  trendingProImgView: {
    borderRightWidth: 1,
    borderRightColor: colors.borderGrey,
    padding: 10,
  },
  trendingProImg: {width: width * 0.17, height: width * 0.17},
  coupunEdge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.whitesmoke,
  },
  orderDetailsHeadText: {
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    color: colors.black,
    marginBottom: 10,
  },
  orderDetailsText: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    color: colors.placeholder,
    marginBottom: 10,
  },
});
