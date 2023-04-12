import React, {useRef, useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {colors} from '../common/colors';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';

const Offers = () => {
  const {height, width} = Dimensions.get('screen');
  const [offers, setOffers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getOfferList();
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getOfferList = async () => {
    await firestore()
      .collection('Offers')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('empty');
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setOffers(objectsArray);
        }
      });
  };

  const handleSearch = async text => {
    await firestore()
      .collection('Offers')
      .orderBy('offerTitle')
      .startAt(text)
      .endAt(text + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('empty');
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setOffers(objectsArray);
        }
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader drawer={false} back={true} logo={false} head={'Offers'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke}}>
        {/* search */}
        <View style={style.searchContainer}>
          <View style={style.searchContainerView}>
            <Image
              style={style.searchContainerImageSearch}
              source={require('../../assets/images/search.png')}
            />
            <TextInput
              style={{
                width: width * 0.5,
                fontFamily: 'Lato-Regular',
                fontSize: 15,
                color: colors.black,
                height: width * 0.1,
                alignItems: 'center',
              }}
              placeholder="Search here.."
              placeholderTextColor={colors.placeholder}
              onChangeText={text => handleSearch(text)}
            />
          </View>
          <Image
            style={style.searchContainerImageMike}
            source={require('../../assets/images/voice.png')}
          />
        </View>
        {/* coupun */}
        {offers.map((item, index) => (
          <View
            key={index}
            style={{
              margin: 15,
              backgroundColor: colors.secondaryGreen,
              width: width * 0.9,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginBottom: 25,
            }}>
            <View style={{alignSelf: 'flex-start'}}>
              <View style={[style.coupunEdge, {marginLeft: -10}]} />
              <View style={[style.coupunEdge, {marginLeft: -10}]} />
              <View style={[style.coupunEdge, {marginLeft: -10}]} />
              <View style={[style.coupunEdge, {marginLeft: -10}]} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 40,
                  color: colors.primaryGreen,
                }}>
                {item.percentage}
              </Text>
              <View>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    color: colors.primaryGreen,
                  }}>
                  %
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    color: colors.primaryGreen,
                  }}>
                  OFF
                </Text>
              </View>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  color: colors.black,
                }}>
                {item.offerTitle}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  color: colors.placeholder,
                }}>
                {item.offerDetails}
              </Text>
            </View>
            <View>
              <View
                style={[style.coupunEdge, {position: 'absolute', top: -10}]}
              />
              <View
                style={[style.coupunEdge, {position: 'absolute', bottom: -10}]}
              />
            </View>
            <View style={{justifyContent: 'center', marginHorizontal: 5}}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  color: colors.black,
                }}>
                Use Code:
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  backgroundColor: colors.primaryGreen,
                  borderRadius: 15,
                  marginTop: 5
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 13,
                    color: colors.white,
                  }}>
                  {item.offerCode}
                </Text>
              </View>
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              <View style={[style.coupunEdge, {marginRight: -10}]} />
              <View style={[style.coupunEdge, {marginRight: -10}]} />
              <View style={[style.coupunEdge, {marginRight: -10}]} />
              <View style={[style.coupunEdge, {marginRight: -10}]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Offers;
