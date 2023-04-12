import React, {useCallback, useState, useRef, useContext} from 'react';
import {Text, TouchableOpacity, View, Image, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from 'react-native-actions-sheet';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import CustomHeader from '../Components/CustomHeader';
import CustomTextInput from '../Components/CustomTextInput';
import CustomButton from '../Components/CustomButton';
import {colors} from '../common/colors';
import {UploadImage} from '../common/storage';
import {AuthContext} from '../common/context';
import {style} from './style';

const Account = () => {
  const {token, profileImage} = useSelector(state => state);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(profileImage ?? '');
  const [filename, setFilename] = useState('');
  const actionSheetRef = useRef('update-image');
  const {updateProfileImageContext} = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      getAccountDetails();
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getAccountDetails = async () => {
    firestore()
      .collection('Users')
      .doc(token)
      .onSnapshot(documentSnapshot => {
        const userDetails = documentSnapshot.data();
        setFirstname(userDetails.firstname ?? '');
        setLastname(userDetails.lastname ?? '');
        setEmail(userDetails.email ?? userDetails.username ?? '');
        setImage(userDetails.image ?? '');
        setPhone(userDetails.phone ?? '');
        updateProfileImageContext({profileImage: userDetails.image ?? ''});
      });
  };

  const handleImage = () => {
    actionSheetRef.current?.show();
  };

  const handleCamera = async () => {
    const options = {mediaType: 'photo'};
    const result = await launchCamera(options);
    setFilename(result.assets[0].uri);
    actionSheetRef.current?.hide();
  };

  const handleLibrary = async () => {
    const options = {mediaType: 'photo'};
    const result = await launchImageLibrary(options);
    setFilename(result.assets[0].uri);
    actionSheetRef.current?.hide();
  };

  const updateProfile = async () => {
    let uploadedUrl = image;
    if (filename !== '') {
      uploadedUrl = await UploadImage(filename);
    }
    await firestore()
      .collection('Users')
      .doc(token)
      .update({
        firstname: firstname,
        lastname: lastname,
        email: email,
        image: uploadedUrl,
        phone: phone,
      })
      .then(() => {
        updateProfileImageContext({profileImage: uploadedUrl ?? ''});
        Snackbar.show({
          text: 'Your profile is updated!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.primaryGreen,
          textColor: colors.white,
        });
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Your Profile'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollContainer}>
        <Text style={style.titleText}>
          {firstname} {lastname}
        </Text>
        <View style={style.commonMargin}>
          <Image
            style={style.image}
            source={
              filename === '' && image === ''
                ? require('../../assets/images/profile-pic.png')
                : {uri: filename === '' ? image : filename}
            }
          />
          <TouchableOpacity onPress={handleImage} style={style.touch}>
            <Image
              style={style.iconImage}
              source={require('../../assets/images/edit-green.png')}
            />
          </TouchableOpacity>
        </View>
        <CustomTextInput
          placeholder={'First Name'}
          value={firstname}
          type="default"
          onChangeText={text => setFirstname(text)}
        />
        <CustomTextInput
          placeholder={'Last Name'}
          value={lastname}
          type="default"
          onChangeText={text => setLastname(text)}
        />
        <CustomTextInput
          placeholder={'Email Address'}
          value={email}
          type="default"
          onChangeText={text => setEmail(text)}
        />
        <CustomTextInput
          placeholder={'Phone number'}
          value={phone}
          type="default"
          onChangeText={text => setPhone(text)}
        />
        <CustomButton
          buttonText={'Update your profile'}
          type={'basic'}
          onClickButton={updateProfile}
        />
      </ScrollView>
      <ActionSheet
        ref={actionSheetRef}
        headerAlwaysVisible={true}
        backgroundInteractionEnabled={false}
        drawUnderStatusBar={true}
        gestureEnabled={true}
        gstatusBarTranslucent
        defaultOverlayOpacity={0.3}>
        <View style={style.commonPadding}>
          <Text style={style.actionText}>Select Option</Text>
          <View style={style.actionTouchView}>
            <TouchableOpacity
              onPress={handleCamera}
              style={style.actionTouchCamera}>
              <Text style={style.actionTouchText}>camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLibrary}
              style={style.actionTouchMedia}>
              <Text style={style.actionTouchText}>Image library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    </View>
  );
};

export default Account;
