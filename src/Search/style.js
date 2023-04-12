import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {margin: 15},
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 15,
    backgroundColor: 'rgba(98,179,99,0.1)',
    borderColor: colors.lightGreen,
    borderWidth: 1,
  },
  searchContainerView: {flexDirection: 'row', alignItems: 'center'},
  searchContainerImageSearch: {width: 20, height: 20, marginRight: 15, resizeMode: 'contain'},
  searchContainerText: {
    fontSize: 15,
    fontFamily: 'Lato-Regular',
    color: colors.placeholder,
  },
  searchContainerImageMike: {width: 20, height: 20},
  headText: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: colors.black,
  },
  recentView: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#d0eef7',
    marginRight: 15,
  },
  recentText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: colors.black,
  },
  trendingView: {
    padding: 10,
    width: width * 0.275,
    height: width * 0.2,
    marginRight: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingImg: {
    width: width * 0.1,
    height: width * 0.175,
    resizeMode: 'contain',
  },
  trendingProView: {width: width, padding: 15, backgroundColor: '#caf0fc'},
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
  sectionFourItemView: {
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
});
