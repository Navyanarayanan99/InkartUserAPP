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
import {style} from './style';
import CustomTextInput from '../Components/CustomTextInput';
import CustomButton from '../Components/CustomButton';
import {colors} from '../common/colors';
import {AuthContext} from '../common/context';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const {signInContext} = useContext(AuthContext);
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('screen');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '33515813402-k2ig39lld3nbqkmfo8q7snti1tb4uq33.apps.googleusercontent.com',
    });
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        await firestore()
          .collection('Users')
          .where('isAdmin', '==', false)
          .where('email', '==', userInfo?.user?.email ?? '')
          .get()
          .then(async snapshot => {
            if (snapshot.empty) {
              Snackbar.show({
                text: 'Your Account is not registerd with our system.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: '#ff6347',
                textColor: colors.white,
              });
            } else {
              snapshot?.docs.forEach(document => {
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
                  }
                }
              });
            }
          });
      } else {
        Snackbar.show({
          text: 'Something went wrong try another method.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      }
    } catch (error) {
      await GoogleSignin.revokeAccess();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Snackbar.show({
          text: 'In progress wait for some time.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.lightGreen,
          textColor: colors.white,
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Snackbar.show({
          text: 'Play services not available.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      } else {
        Snackbar.show({
          text: 'Something went wrong try another method.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      }
    }
  };

  const handleSignIn = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      await firestore()
        .collection('Users')
        .where('username', '==', username.trim())
        .where('password', '==', password.trim())
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            setError('Username or password incorrect!');
          } else {
            snapshot?.docs.forEach(document => {
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
                }
              }
            });
          }
        });
    }
  };

  const guestSignIn = async () => {
    await firestore()
      .collection('Users')
      .where('username', '==', 'guest')
      .where('password', '==', 'guest')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setError('Username or password incorrect!');
        } else {
          snapshot?.docs.forEach(document => {
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
              }
            }
          });
        }
      });
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
            marginTop: 25,
            fontSize: 20,
            color: colors.placeholder,
            fontFamily: 'Lato-Bold',
          }}>
          Login Account
        </Text>

        {error ? (
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              color: colors.red,
              fontFamily: 'Lato-Regular',
            }}>
            {error}
          </Text>
        ) : null}
        <CustomTextInput
          placeholder={'Email Address'}
          value={username}
          type="email"
          onChangeText={text => setUsername(text)}
          error={errorFields}
        />
        <CustomTextInput
          placeholder={'Password'}
          value={password}
          type="password"
          onChangeText={text => setPassword(text)}
          error={errorFields}
        />
        <CustomButton
          buttonText={'Sign In'}
          type={'basic'}
          onClickButton={handleSignIn}
        />
        <TouchableOpacity
          style={{
            marginVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              color: colors.placeholder,
              fontFamily: 'Lato-Regular',
              fontSize: 16,
            }}>
            If you are new, create Now
          </Text>
        </TouchableOpacity>
        <View style={{marginTop: width * 0.08}}>
          <View style={{overflow: 'hidden'}}>
            <View
              style={{
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: colors.placeholder,
                margin: -2,
                marginBottom: 0,
              }}
            />
          </View>
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
              Or Login With
            </Text>
          </View>
        </View>
        <CustomButton
          buttonText={'Login With Phone'}
          type={'custom'}
          icon={'phone'}
          onClickButton={() => navigation.navigate('SignInWithPhone')}
        />
        <CustomButton
          buttonText={'Login With Google'}
          type={'custom'}
          icon={'google'}
          onClickButton={googleSignIn}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={guestSignIn}
        style={{
          bottom: 0,
          padding: 15,
          backgroundColor: 'rgba(98, 99, 98, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            fontSize: 16,
            color: colors.black,
          }}>
          Login as a guest
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;
