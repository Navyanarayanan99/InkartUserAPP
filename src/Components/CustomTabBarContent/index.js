import React, {useContext} from 'react';
import {Dimensions, View, Text, Image, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import {colors} from '../../common/colors';
import {AppContext, AuthContext} from '../../common/context';

const CustomTabBarContent = ({state, descriptors, navigation}) => {
  const {width, height} = Dimensions.get('screen');
  const {cartCount} = useSelector(state => state);
  
  return (
    <View
      style={{
        width: width,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.primaryGreen,
        paddingVertical: 12,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const icon =
          route.name === 'Home'
            ? require('../../../assets/images/home-white.png')
            : route.name === 'Category'
            ? require('../../../assets/images/category-white.png')
            : route.name === 'Search'
            ? require('../../../assets/images/search-white.png')
            : route.name === 'Offers'
            ? require('../../../assets/images/offers-white.png')
            : require('../../../assets/images/cart-white.png');

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: width / 5,
            }}>
            {isFocused ? (
              <Text
                style={{
                  color: colors.white,
                  fontSize: 35,
                  textAlign: 'left',
                  marginTop: -35,
                }}>
                .
              </Text>
            ) : null}
            {cartCount && cartCount > 0 && label === 'Cart' ? (
              <View
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: colors.red,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  right: 18,
                  zIndex: 99,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    textAlign: 'center',
                    fontSize: 12,
                    color: colors.white,
                  }}>
                  {cartCount}
                </Text>
              </View>
            ) : null}
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: 'cover',
                marginBottom: 5,
              }}
              source={icon}
            />
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 12,
                color: colors.white,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBarContent;
