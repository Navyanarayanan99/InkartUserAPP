import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {colors} from '../../common/colors';
import {style} from './style';
import {AppContext, AuthContext} from '../../common/context';
import CustomToggle from '../CustomToggle';
import {useSelector} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const CustomDrawerContent = props => {
  const {width, height} = Dimensions.get('screen');
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const navigation = useNavigation();
  const {signOutContext} = useContext(AuthContext);
  const {profileImage, firstname, lastname, email, token} = useSelector(
    state => state,
  );

  const handleSignOut = async () => {
    signOutContext();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };

  const Item = props => {
    const {icon, text, onPress, type, toggle} = {...props};
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 12,
          marginLeft: type && type === 'nested' ? 20 : 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: type && type === 'nested' ? 20 : 25,
              height: type && type === 'nested' ? 20 : 25,
              resizeMode: 'cover',
            }}
            source={icon}
          />
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: type && type === 'nested' ? 12 : 14,
              marginLeft: 15,
              color: colors.black,
            }}>
            {text}
          </Text>
        </View>
        {toggle ? (
          <CustomToggle />
        ) : (
          <Image
            style={{
              width: type && type === 'nested' ? 20 : 25,
              height: type && type === 'nested' ? 20 : 25,
              resizeMode: 'cover',
              backgroundColor: colors.secondaryGreen,
              borderRadius: type && type === 'nested' ? 20 : 25,
              overflow: 'hidden',
            }}
            source={require('../../../assets/images/arrow-right.png')}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}>
      <View>
        {/* profile */}
        {token !== 'nKCppQLqdgnmCRfGS1Pq' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Account')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 15,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderGrey,
            }}>
            <Image
              style={{
                width: width * 0.15,
                height: width * 0.15,
                borderRadius: width * 0.15,
                resizeMode: 'cover',
                alignSelf: 'center',
                overflow: 'hidden',
              }}
              source={
                profileImage !== '' && profileImage !== null
                  ? {uri: profileImage}
                  : require('../../../assets/images/profile-pic.png')
              }
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 15,
                  color: colors.black,
                }}>
                {firstname} {lastname}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  color: colors.borderGrey,
                }}>
                {email}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        <View style={{margin: 15}}>
          <Item
            text={'Home'}
            icon={require('../../../assets/images/home.png')}
            onPress={() => navigation.navigate('Home')}
          />
          <Item
            text={'Shop by category'}
            icon={require('../../../assets/images/drawer.png')}
            onPress={() => navigation.navigate('Categories')}
          />
          <Item
            text={'Orders'}
            icon={require('../../../assets/images/orders.png')}
            onPress={() => navigation.navigate('Orders')}
          />
          <Item
            text={'Your Wishlist'}
            icon={require('../../../assets/images/wishlist.png')}
            onPress={() => navigation.navigate('Wishlist')}
          />
          {token !== 'nKCppQLqdgnmCRfGS1Pq' ? (
            <Item
              text={'Your Account'}
              icon={require('../../../assets/images/user.png')}
              onPress={() => navigation.navigate('Account')}
            />
          ) : null}
          {/* <Item
            text={'Notification'}
            icon={require('../../../assets/images/bell.png')}
            onPress={() => navigation.navigate('Offers')}
          /> */}
          {/* <Item
            text={'Settings'}
            icon={require('../../../assets/images/settings.png')}
            onPress={() => navigation.navigate('Offers')}
          /> */}
          {/* <Item
            text={'Dark'}
            icon={require('../../../assets/images/paint.png')}
            onPress={() => navigation.navigate('Categories')}
            toggle={true}
          /> */}
        </View>
        {/* signOut */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            width: width * 0.3,
            backgroundColor: colors.secondaryGreen,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: colors.borderGrey,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            margin: 15,
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 25,
              height: 25,
              resizeMode: 'cover',
              backgroundColor: colors.secondaryGreen,
              borderRadius: 25,
              overflow: 'hidden',
            }}
            source={require('../../../assets/images/arrow-right.png')}
          />
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 14,
              marginLeft: 10,
              color: colors.black,
            }}>
            Sign Out
          </Text>
        </TouchableOpacity>
        {/* <Image
          source={require('../../../assets/images/logo-seeting.jpeg')}
          style={{
            width: width * 0.4,
            height: width * 0.2,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginVertical: 15,
          }}
        /> */}
        {/* contact support */}
        <View
          style={{
            backgroundColor: colors.secondaryGreen,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: colors.borderGrey,
            padding: 10,
            margin: 15,
          }}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 14,
              color: colors.black,
            }}>
            Contact Support
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 12,
              color: colors.placeholder,
            }}>
            If you have any problem with the app, feel free to contact our 24
            hours support system.
          </Text>
          <View
            style={{
              width: width * 0.25,
              backgroundColor: colors.primaryGreen,
              borderRadius: 15,
              alignItems: 'center',
              padding: 10,
              marginTop: 15,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 14,
                color: colors.white,
              }}>
              Contact
            </Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
