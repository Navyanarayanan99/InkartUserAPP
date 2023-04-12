import React, {useRef, useState, useCallback} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {colors} from '../common/colors';
import {AppContext, AuthContext} from '../common/context';
import CustomButton from '../Components/CustomButton';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import Accordion from 'react-native-collapsible/Accordion';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomTextInput from '../Components/CustomTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {updateWishlistIds} from '../../storage/action';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import StarRating from 'react-native-star-rating';

const ProductReview = props => {
  const {productId, categoryId} = props.route.params;
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const actionSheetRef = useRef('add-review');
  const {token, profileImage, firstname, lastname} = useSelector(
    state => state,
  );

  useFocusEffect(
    useCallback(() => {
      getReviews(productId);
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getReviews = async id => {
    await firestore()
      .collection('Reviews')
      .where('productId', '==', id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setReviews([]);
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setReviews(objectsArray);
        }
      });
  };

  const addReview = async () => {
    if (review !== '' && stars >= 1) {
      await firestore()
        .collection('Reviews')
        .add({
          created: Date.now(),
          updated: Date.now(),
          review: review,
          profileImage: profileImage,
          star: stars,
          productId: productId,
          categoryId: categoryId,
          userId: token,
          userName: firstname + ' ' + lastname,
          status: 'pending',
        })
        .then(resp => {
          actionSheetRef.current?.hide();
          getReviews(productId);
          Snackbar.show({
            text: 'Your Review is Added!',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
        });
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Reviews'}
        addButton={true}
        handleAdd={() => actionSheetRef.current?.show()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke, margin: 15}}>
        {/* review */}
        {reviews.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                marginVertical: 10,
                padding: 20,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                    borderRadius: 50,
                  }}
                  source={
                    item?.profileImage !== ''
                      ? {uri: item?.profileImage}
                      : require('../../assets/images/profile-pic.png')
                  }
                />
                <View style={{marginLeft: 15}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.black,
                      fontFamily: 'Lato-Regular',
                    }}>
                    {item.userName}
                  </Text>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={item?.star}
                    fullStarColor={'#ffd700'}
                    starStyle={{fontSize: 25}}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.black,
                  fontFamily: 'Lato-Regular',
                }}>
                {item?.review}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <ActionSheet
        ref={actionSheetRef}
        headerAlwaysVisible={true}
        backgroundInteractionEnabled={false}
        drawUnderStatusBar={true}
        gestureEnabled={true}
        gstatusBarTranslucent
        defaultOverlayOpacity={0.3}>
        <View style={{padding: 15}}>
          <Text
            style={{
              fontFamily: 'Lato-Black',
              textAlign: 'center',
              fontSize: 18,
              marginBottom: 20,
              color: colors.black,
            }}>
            Add your Review
          </Text>
          <CustomTextInput
            placeholder={'Type your review here.'}
            value={review}
            type="default"
            onChangeText={text => setReview(text)}
            multiline={true}
          />
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 18,
                marginVertical: 10,
                color: colors.black,
              }}>
              Select starts
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={stars}
                selectedStar={rating => setStars(rating)}
                fullStarColor={'#ffd700'}
              />
            </View>
          </View>

          <CustomButton
            buttonText={'Submit your Review'}
            type={'basic'}
            onClickButton={addReview}
          />
        </View>
      </ActionSheet>
    </View>
  );
};

export default ProductReview;
