import React, {useContext, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../Components/CustomHeader';

const Settings = () => {
  const {width, height} = Dimensions.get('screen');

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <CustomHeader drawer={true} back={false} logo={true} />
      <View
        style={{
          paddingVertical: 15,
          margin: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 22,
            textAlign: 'center',
          }}>
          Admin Settings
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-light',
            fontSize: 12,
            textAlign: 'center',
            padding: 15,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Image
          source={require('../../assets/images/logo-small.jpeg')}
          style={{
            width: width * 0.4,
            height: width * 0.2,
            resizeMode: 'cover',
          }}
        />
      </View>
    </View>
  );
};

export default Settings;
