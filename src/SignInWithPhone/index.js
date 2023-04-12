import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {style} from './style';
import CustomTextInput from '../Components/CustomTextInput';
import CustomButton from '../Components/CustomButton';
import {colors} from '../common/colors';
import {AuthContext} from '../common/context';
import auth from '@react-native-firebase/auth';

const SignInWithPhone = () => {
  const {width, height} = Dimensions.get('screen');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [logininfo, setLoginInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeField, showCodeField] = useState(false);
  const navigation = useNavigation();
  const {signInContext} = useContext(AuthContext);

  const handleSendCode = async () => {
    if (phone !== '') {
      showCodeField(false);
      setLoading(true);
      await firestore()
        .collection('Users')
        .where('isAdmin', '==', false)
        .where('phone', '==', phone)
        .get()
        .then(async snapshot => {
          if (snapshot.empty) {
            Snackbar.show({
              text: 'Your Account is not registerd with our system.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: '#ff6347',
              textColor: colors.white,
            });
            setLoading(false);
          } else {
            const confirmation = await auth().signInWithPhoneNumber(
              '+91' + phone,
            );
            setConfirm(confirmation);
            Snackbar.show({
              text: 'A verification code is sent to your mobile number.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.primaryGreen,
              textColor: colors.white,
            });
            showCodeField(true);
            setLoading(false);
            setLoginInfo(snapshot?.docs);
          }
        });
    } else {
      Snackbar.show({
        text: 'Fill the required fields correctly to continue.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#ff6347',
        textColor: colors.white,
      });
    }
  };

  const confirmCode = async () => {
    try {
      setLoading(true);
      await confirm.confirm(code);
      Snackbar.show({
        text: 'Code Verified!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.primaryGreen,
        textColor: colors.white,
      });
      logininfo.forEach(document => {
        if (document.exists) {
          const result = document?.data();
          if (!result.isAdmin) {
            signInContext({
              userId: document.id,
              profileImage: result?.image,
              firstname: result?.firstname ?? '',
              lastname: result?.lastname ?? '',
              email: result?.email ?? '',
            });
            setLoading(false);
          }
        }
      });
    } catch (error) {
      Snackbar.show({
        text: 'The code you entered is incorrect.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#ff6347',
        textColor: colors.white,
      });
    }
  };

  return (
    <View style={style.container}>
      <Image
        source={require('../../assets/images/topBg.png')}
        style={{width: '100%', height: '15%'}}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: -40,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: colors.white,
          overflow: 'hidden',
        }}
        contentContainerStyle={{
          margin: 18,
        }}>
        <Image
          source={require('../../assets/images/app-name.jpeg')}
          style={{width: 125, height: 50, resizeMode: 'contain'}}
        />
        {/* <Text
          style={{
            marginTop: 10,
            fontFamily: 'Lato-Regular',
            fontSize: 14,
            color: colors.placeholder,
          }}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old.
        </Text> */}
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            color: colors.placeholder,
            fontFamily: 'Lato-Bold',
          }}>
          Enter Your Phone Number
        </Text>
        <CustomTextInput
          placeholder={'Mobile Number'}
          type="default"
          keyboardType={'number'}
          onChangeText={text => setPhone(text)}
        />

        {codeField ? (
          <CustomTextInput
            placeholder={'Enter Code'}
            type="default"
            keyboardType={'number'}
            onChangeText={text => setCode(text)}
          />
        ) : null}
        <CustomButton
          loading={loading}
          buttonText={codeField ? 'Sign In' : 'Sent Code'}
          type={'basic'}
          onClickButton={codeField ? confirmCode : handleSendCode}
        />
        <TouchableOpacity
          style={{
            marginVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 25,
          }}
          onPress={() => navigation.navigate('SignIn')}>
          <Text
            style={{
              color: colors.placeholder,
              fontFamily: 'Lato-Regular',
              fontSize: 14,
            }}>
            Go to login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignInWithPhone;
