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
import {colors} from '../../common/colors';
import {style} from './style';

const CustomToggle = props => {
  const {} = {
    ...props,
  };
  const {width, height} = Dimensions.get('screen');
  return (
    <View style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        borderColor: colors.placeholder,
        borderWidth: 2,
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 20,
          height: 18,
          borderRadius: 10,
          backgroundColor: colors.primaryGreen,
        }}></View>
    </View>
  );
};

export default CustomToggle;
