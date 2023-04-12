import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../common/colors';
import {style} from './style';

const CustomButton = props => {
  const {buttonText, onClickButton, type, icon, loading = false} = {...props};
  return (
    <>
      <View style={style.container}>
        <TouchableOpacity
          disabled={loading}
          onPress={onClickButton}
          style={
            type === 'basic'
              ? style.BasicButtonContainer
              : type === 'custom'
              ? style.CustomButtonContainer
              : null
          }>
          {icon ? (
            icon === 'phone' ? (
              <Image
                source={require('../../../assets/images/phone.png')}
                style={style.iconStyle}
              />
            ) : icon === 'google' ? (
              <Image
                source={require('../../../assets/images/google.png')}
                style={style.iconStyle}
              />
            ) : null
          ) : null}
          {loading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Text
              style={
                type === 'basic'
                  ? style.BasicButtonText
                  : type === 'custom'
                  ? style.CustomButtonText
                  : null
              }>
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CustomButton;
