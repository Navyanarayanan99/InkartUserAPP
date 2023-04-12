import React, {useContext, useState, useEffect} from 'react';
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
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {UploadImage} from '../common/storage';

const SignUp = () => {
  const {width, height} = Dimensions.get('screen');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();
  const {signUpContext, updateProfileImageContext} = useContext(AuthContext);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '33515813402-k2ig39lld3nbqkmfo8q7snti1tb4uq33.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const handleSignUp = async () => {
    if (
      username !== '' &&
      password !== '' &&
      phone !== '' &&
      password === cpassword
    ) {
      await firestore()
        .collection('Users')
        .where('isAdmin', '==', false)
        .where('username', '==', username)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            firestore()
              .collection('Users')
              .add({
                isAdmin: false,
                password: password,
                username: username,
                phone: phone,
              })
              .then(resp => {
                Snackbar.show({
                  text: 'Your Account is created successfully!',
                  duration: Snackbar.LENGTH_LONG,
                  backgroundColor: colors.primaryGreen,
                  textColor: colors.white,
                });
                signUpContext({
                  userId: resp.id,
                  profileImage: '',
                  lastname: '',
                  firstname: '',
                  email: username,
                });
              });
          } else {
            Snackbar.show({
              text: 'There is an existing account for you, try to login.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: '#ff6347',
              textColor: colors.black,
            });
          }
        });
    } else {
      Snackbar.show({
        text: 'Fill the required fields correctly to continue creating your new account.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#ff6347',
        textColor: colors.black,
      });
    }
  };

  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        await firestore()
          .collection('Users')
          .where('isAdmin', '==', false)
          .where('email', '==', userInfo?.user?.email)
          .get()
          .then(async snapshot => {
            if (snapshot.empty) {
              let uploadedUrl = '';
              if (userInfo?.user?.photo != null) {
                uploadedUrl = await UploadImage(
                  userInfo?.user?.photo,
                  'google',
                );
              }
              firestore()
                .collection('Users')
                .add({
                  isAdmin: false,
                  password: '',
                  username: userInfo?.user?.email,
                  email: userInfo?.user?.email,
                  phone: '',
                  firstname: userInfo?.user?.givenName,
                  lastname: userInfo?.user?.familyName,
                  image: uploadedUrl ?? '',
                })
                .then(resp => {
                  Snackbar.show({
                    text: 'Your Account is created successfully!',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: colors.primaryGreen,
                    textColor: colors.white,
                  });
                  signUpContext({
                    userId: resp.id,
                    profileImage: uploadedUrl,
                    lastname: userInfo?.user?.familyName,
                    firstname: userInfo?.user?.givenName,
                    email: userInfo?.user?.email,
                  });
                  updateProfileImageContext({profileImage: uploadedUrl ?? ''});
                });
            } else {
              Snackbar.show({
                text: 'There is an existing account for you, try to login.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: '#ff6347',
                textColor: colors.black,
              });
            }
          });
      }
    } catch (error) {
      await GoogleSignin.revokeAccess();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('canceled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
      }
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
          Sign Up Account
        </Text>
        <CustomTextInput
          placeholder={'Email Address'}
          type="email"
          onChangeText={text => setUsername(text)}
        />
        <CustomTextInput
          placeholder={'Mobile Number'}
          type="default"
          onChangeText={text => setPhone(text)}
        />
        <CustomTextInput
          placeholder={'Password'}
          type="password"
          onChangeText={text => setPassword(text)}
        />
        <CustomTextInput
          placeholder={'Confirm Password'}
          type="password"
          onChangeText={text => setCpassword(text)}
        />
        <CustomButton
          buttonText={'Sign Up'}
          type={'basic'}
          onClickButton={handleSignUp}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: -10,
            backgroundColor: colors.white,
            width: 110,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.placeholder,
              fontFamily: 'Lato-Regular',
              fontSize: 16,
            }}>
            Or Signup With
          </Text>
        </View>
        <View
          style={{
            marginBottom: 15,
          }}>
          <CustomButton
            buttonText={'Signup With Google'}
            type={'custom'}
            icon={'google'}
            onClickButton={googleSignUp}
          />
          <TouchableOpacity
            style={{
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
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
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
