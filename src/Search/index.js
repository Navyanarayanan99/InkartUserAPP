import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useContext, useState, useCallback} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../common/colors';
import firestore from '@react-native-firebase/firestore';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {updateSearchList} from '../../storage/action';

const Search = () => {
  const {width, height} = Dimensions.get('screen');
  const [products, setProducts] = useState([]);
  const {search, categories} = useSelector(state => state);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
      .orderBy('updated', 'desc')
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

  const handleGotoProducts = (data, type) => {
    if (type === 'category') {
      navigation.navigate('Products', {categoryData: data, type: 'category'});
    } else if (type === 'all') {
      navigation.navigate('Products', {categoryData: {}, type: 'all'});
    }
  };

  const handleSearch = () => {
    dispatch(updateSearchList({search: [...search, searchText.trim()]}));
    setSearchText('');
    navigation.navigate('SearchResults', {searchText: searchText.trim()});
  };

  return (
    <View style={style.container}>
      <CustomHeader drawer={false} back={true} logo={false} head={'Search'} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
              onChangeText={text => setSearchText(text)}
              onEndEditing={handleSearch}
            />
          </View>
          <Image
            style={style.searchContainerImageMike}
            source={require('../../assets/images/voice.png')}
          />
        </View>
        {/* recent search */}
        {search.length > 0 ? (
          <View style={style.margin}>
            <Text style={style.headText}>Recently Search</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginVertical: 15}}>
              {search.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SearchResults', {searchText: item})
                    }
                    key={index}
                    style={style.recentView}>
                    <Text style={style.recentText}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* trending category */}
        <View style={style.margin}>
          <Text style={style.headText}>Trending Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginVertical: 15}}>
            {categories.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handleGotoProducts(item, 'category')}
                  key={index}
                  style={[
                    style.trendingView,
                    {
                      backgroundColor:
                        index % 4 === 0
                          ? '#FFD700'
                          : index % 4 === 1
                          ? '#FFDAB9'
                          : index % 4 === 2
                          ? '#66CDAA'
                          : index % 4 === 3
                          ? '#FF6347'
                          : '#FFD700',
                    },
                  ]}>
                  <Image style={style.trendingImg} source={{uri: item.image}} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* trending products */}
        <View style={{width: width, padding: 15, backgroundColor: '#ADD8E6'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black,
                  fontFamily: 'Lato-Bold',
                }}>
                Say hello to offers!
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black,
                  fontFamily: 'Lato-Regular',
                  textAlign: 'center',
                }}>
                Best price ever of all the time.
              </Text>
            </View>
            <Text
              onPress={() => handleGotoProducts({}, 'all')}
              style={{
                fontSize: 18,
                color: colors.black,
                fontFamily: 'Lato-Regular',
              }}>
              See All
            </Text>
          </View>
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
                  <View
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
                  </View>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
