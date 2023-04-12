import {StyleSheet, Dimensions, Platform} from 'react-native';
import { colors } from '../common/colors';

const {width, height} = Dimensions.get('screen');
export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  searchContainerImageSearch: {width: 20, height: 20, marginRight: 15},
  searchContainerText: {
    fontSize: 15,
    fontFamily: 'Lato-Regular',
    color: colors.placeholder,
  },
  searchContainerImageMike: {width: 20, height: 20},
});
