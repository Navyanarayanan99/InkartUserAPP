import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
} from 'react-native';
import {colors} from '../common/colors';
import firestore from '@react-native-firebase/firestore';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';

const SearchResults = props => {
  const searchText = props.route.params.searchText;
  const {width} = Dimensions.get('screen');
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getProductList();
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getProductList = async () => {
    await firestore()
      .collection('Products')
      .orderBy('name')
      .startAt(searchText)
      .endAt(searchText + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setProducts([]);
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setProducts(objectsArray);
        }
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Search Results'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{width: width, padding: 15}}>
          {products.length > 0 ? (
            <>
              {products.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {productDetail: item})
                  }
                  style={style.sectionFourItemView}
                  key={index}>
                  <View
                    style={{
                      borderRightWidth: 1,
                      borderRightColor: colors.borderGrey,
                      padding: 10,
                    }}>
                    <Image
                      style={{width: width * 0.17, height: width * 0.17}}
                      source={
                        item.image === ''
                          ? require('../../assets/images/fruit.png')
                          : {uri: item.image}
                      }
                    />
                  </View>
                  <View style={{width: width * 0.55}}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 18,
                        color: colors.black,
                        fontFamily: 'Lato-Bold',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 15,
                        color: colors.black,
                        fontFamily: 'Lato-Regular',
                      }}>
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.black,
                          fontFamily: 'Lato-Bold',
                        }}>
                        ₹{item.price}
                      </Text>
                      {/* <View
                    style={{
                      backgroundColor: colors.primaryGreen,
                      padding: 5,
                      justifyContent: 'center',
                      borderRadius: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.white,
                        fontFamily: 'Lato-Regular',
                      }}>
                      50% OFF
                    </Text>
                  </View> */}
                      <View
                        style={{
                          borderColor: colors.borderGrey,
                          borderWidth: 1,
                          padding: 5,
                          justifyContent: 'center',
                          borderRadius: 15,
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          width: width * 0.2,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: 'Lato-Black',
                            marginTop: -10,
                          }}>
                          _
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: colors.primaryGreen,
                            fontFamily: 'Lato-Regular',
                          }}>
                          0
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: 'Lato-Black',
                          }}>
                          +
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'Lato-Black', marginTop: 20}}>No Results Found</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchResults;
