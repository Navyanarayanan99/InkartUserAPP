import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {colors} from '../../common/colors';
import {style} from './style';

const RenderIcon = props => {
  const {iconType, passwordShow} = {...props};
  const imagePath =
    iconType === 'password'
      ? passwordShow
        ? require('../../../assets/images/view.png')
        : require('../../../assets/images/hide.png')
      : iconType === 'email'
      ? require('../../../assets/images/email.png')
      : iconType === 'search-field'
      ? require('../../../assets/images/search.png')
      : null;
  return (
    <>
      <Image source={imagePath} style={style.iconStyle} />
    </>
  );
};

const CustomTextInput = props => {
  const {
    value,
    placeholder,
    type,
    onChangeText,
    error,
    multiline,
    keyboardType,
    iconText,
    onIconPress,
    iconPathEnd,
    iconPathStart,
  } = {...props};
  const {width, height} = Dimensions.get('window');
  const [focus, setFocus] = useState(false);
  const [color, setColor] = useState(colors.grey);
  const [brColor, setBrColor] = useState(
    error?.includes(type) ? colors.red : colors.borderGrey,
  );
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (focus) {
      setColor(colors.lightGreen);
      setBrColor(colors.lightGreen);
    } else {
      setColor(colors.grey);
      setBrColor(error?.includes(type) ? colors.red : colors.borderGrey);
    }
  }, [focus]);

  const togglePassword = () => {
    setPasswordShow(!passwordShow);
  };

  return (
    <View style={style.container}>
      <View
        style={[
          style.textInputContainer,
          {borderColor: brColor, backgroundColor: colors.secondaryGreen},
        ]}>
        {iconPathStart ? (
          <Image source={iconPathStart} style={style.iconStyleStart} />
        ) : null}
        <TextInput
          style={[
            style.customTextInput,
            {
              width:
                type === 'search-field'
                  ? width * 0.825
                  : type === 'icon-as-text'
                  ? width * 0.75
                  : type === 'default'
                  ? width * 0.9
                  : iconPathStart
                  ? width * 0.72
                  : width * 0.8,
              padding: type === 'search-field' ? width * 0.03 : width * 0.05,
              height: multiline ? width * 0.4 : width * 0.15,
            },
          ]}
          secureTextEntry={type === 'password' ? !passwordShow : false}
          selectionColor={color}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          onChangeText={onChangeText}
          defaultValue={value}
          keyboardType={keyboardType === 'number' ? 'decimal-pad' : 'default'}
          multiline={multiline ?? false}
        />
        {type === 'email' || type === 'password' ? (
          <TouchableOpacity
            disabled={type === 'password' ? false : true}
            onPress={togglePassword}>
            <RenderIcon iconType={type} passwordShow={passwordShow} />
          </TouchableOpacity>
        ) : type === 'search-field' ? (
          <RenderIcon iconType={type} />
        ) : type === 'icon-as-text' ? (
          <Text
            onPress={onIconPress}
            style={{
              color: colors.primaryGreen,
              fontFamily: 'Lato-Regular',
              paddingRight: 10,
            }}>
            {iconText}
          </Text>
        ) : (
          <View></View>
        )}
        {iconPathEnd ? (
          <Image source={iconPathEnd} style={style.iconStyle} />
        ) : null}
      </View>
    </View>
  );
};

export default CustomTextInput;
