import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {colors} from '../../common/colors';
import CustomTextInput from '../CustomTextInput';
import {style} from './style';

const CustomHeader = props => {
  const {
    drawer,
    back,
    logo,
    head,
    search,
    searchText,
    onSearch,
    addButton,
    handleAdd,
    share,
    handleShare,
    cart,
  } = {
    ...props,
  };
  const {width, height} = Dimensions.get('screen');
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const navigation = useNavigation();
  const {cartCount} = useSelector(state => state);

  return (
    <View style={style.container}>
      <View
        style={{
          width: width * 0.925,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop:
            Platform.OS === 'ios'
              ? statusBarHeight * 0.8
              : StatusBar.currentHeight * 0.5,
          marginBottom: 15,
        }}>
        {back ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 15,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={{width: 25, height: 25, resizeMode: 'cover'}}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 18,
                marginLeft: 15,
                color: colors.black,
              }}>
              {head}
            </Text>
          </View>
        ) : (
          <></>
        )}
        {drawer ? (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image
              style={{width: 40, height: 40, resizeMode: 'cover'}}
              source={require('../../../assets/images/drawer.png')}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {logo ? (
          <Image
            source={require('../../../assets/images/logo-small.jpeg')}
            style={{
              width: width * 0.4,
              height: width * 0.1,
              resizeMode: 'contain',
            }}
          />
        ) : (
          <></>
        )}
        {addButton ? (
          <TouchableOpacity onPress={handleAdd} style={{paddingTop: 15}}>
            <Image
              style={{width: 25, height: 25, resizeMode: 'contain'}}
              source={require('../../../assets/images/add.png')}
            />
          </TouchableOpacity>
        ) : null}
        {share || cart ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {share ? (
              <TouchableOpacity onPress={handleShare} style={{paddingTop: 15}}>
                <Image
                  style={{width: 25, height: 25, resizeMode: 'contain'}}
                  source={require('../../../assets/images/share.png')}
                />
              </TouchableOpacity>
            ) : null}
            {cart ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Cart')}
                style={{paddingTop: 15, marginLeft: 25}}>
                <View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: colors.red,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 8,
                    right: 2,
                    zIndex: 99,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Regular',
                      textAlign: 'center',
                      fontSize: 14,
                      color: colors.white,
                    }}>
                    {cartCount}
                  </Text>
                </View>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                  source={require('../../../assets/images/cart.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
      {search ? (
        <View
          style={{
            borderTopColor: colors.borderGrey,
            borderTopWidth: 0.5,
            width: width,
            justifyContent: 'center',
          }}>
          <CustomTextInput
            placeholder={'Search here...'}
            type="search-field"
            onChangeText={text => onSearch(text)}
            error={[]}
          />
        </View>
      ) : null}
    </View>
  );
};

export default CustomHeader;
