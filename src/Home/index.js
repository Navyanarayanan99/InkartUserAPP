import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState, useContext} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../common/colors';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {AppContext, AuthContext} from '../common/context';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import {updateSearchList, updateWishlistIds} from '../../storage/action';
import {getRecentProducts} from '../common/commonFunctions';

const Home = () => {
  const {width} = Dimensions.get('screen');
  const navigation = useNavigation();
  const {token, search, cartCount, whishlistIds} = useSelector(state => state);
  const {updateCategoriesContext, updateCartCountContext} =
    useContext(AuthContext);
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      getBannerList();
      getProductList();
      getCategoryList();
      getWishlistIds();
      getRecentProducts(token).then(res => {
        const result = res.filter(
          (v, i, a) => a.findIndex(v2 => v2.productId === v.productId) === i,
        );
        setRecentProducts(result);
      });
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getWishlistIds = async () => {
    await firestore()
      .collection('Wishlist')
      .where('userId', '==', token)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          dispatch(updateWishlistIds({whishlistIds: []}));
        } else {
          const wishIdArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              wishIdArray.push(document?.data().productId);
            }
          });
          dispatch(updateWishlistIds({whishlistIds: wishIdArray}));
        }
      });
  };

  const getCategoryList = async () => {
    await firestore()
      .collection('Categories')
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
          updateCategoriesContext({categories: objectsArray});
          setCategories(objectsArray);
        }
      });
  };

  const getProductList = async () => {
    await firestore()
      .collection('Products')
      .orderBy('updated', 'desc')
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
          setProducts(objectsArray);
        }
      });
  };

  const getBannerList = async () => {
    await firestore()
      .collection('Banners')
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
          setBanners(objectsArray);
        }
      });
  };

  const addToCart = async item => {
    await firestore()
      .collection('Cart')
      .where('productId', '==', item.id)
      .where('userId', '==', token)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          firestore()
            .collection('Cart')
            .add({
              created: '"' + Date.now() + '"',
              description: item.description,
              name: item.name,
              price: item.price,
              productId: item.id,
              quantity: 1,
              userId: token,
              image: item.image,
            })
            .then(resp => {
              console.log(resp);
              updateCartCountContext({cartCount: cartCount + 1});
              Snackbar.show({
                text: 'Item added to cart!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
            });
        } else {
          firestore()
            .collection('Cart')
            .doc(snapshot?.docs[0].id)
            .update({
              quantity: parseInt(snapshot?.docs[0].data().quantity) + 1,
              price:
                parseFloat(snapshot?.docs[0].data().price) +
                parseFloat(item.price),
            })
            .then(() => {
              Snackbar.show({
                text: 'Item added to cart!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
            });
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

  const addToWishlist = async item => {
    await firestore()
      .collection('Wishlist')
      .where('userId', '==', token)
      .where('productId', '==', item.id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          firestore()
            .collection('Wishlist')
            .add({
              created: '"' + Date.now() + '"',
              updated: '"' + Date.now() + '"',
              description: item.description,
              name: item.name,
              price: item.price,
              productId: item.id,
              categoryId: item.categoryId,
              userId: token,
              image: item.image,
            })
            .then(resp => {
              dispatch(
                updateWishlistIds({whishlistIds: [...whishlistIds, item.id]}),
              );
              Snackbar.show({
                text: 'Item added to your wishlist!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
            });
        } else {
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              firestore()
                .collection('Wishlist')
                .doc(document.id)
                .delete()
                .then(() => {
                  const filteredWhishlistIds = whishlistIds.filter(
                    element => element !== item.id,
                  );
                  dispatch(
                    updateWishlistIds({whishlistIds: filteredWhishlistIds}),
                  );
                  Snackbar.show({
                    text: 'Product Removed from your wishlist!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.primaryGreen,
                    textColor: colors.white,
                  });
                });
            }
          });
        }
      });
  };

  const handleGoToProductDetails = item => {
    firestore()
      .collection('Products')
      .doc(item.productId)
      .onSnapshot(documentSnapshot => {
        const productData = documentSnapshot.data();
        navigation.navigate('ProductDetails', {
          productDetail: {id: documentSnapshot.id, ...productData},
        });
      });
  };

  const handleSearch = () => {
    dispatch(updateSearchList({search: [...search, searchText.trim()]}));
    setSearchText('');
    navigation.navigate('SearchResults', {searchText: searchText.trim()});
  };

  return (
    <View style={style.container}>
      <CustomHeader drawer={true} back={false} logo={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
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
                fontSize: 16,
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
        {/* section one banners */}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={style.sectionOneScrollview}>
          {banners.map((item, index) => (
            <ImageBackground
              key={index}
              style={style.sectionOneImgBg}
              source={{uri: item.image}}>
              <Text style={style.sectionOneHeadtext}>
                {item.heading ?? 'Fresh Veges'}
              </Text>
              <Text style={style.sectionOnetext}>
                {item.secondaryHeading ?? 'Free Delivery'}
              </Text>
              <TouchableOpacity style={style.sectionOneTouch}>
                <Text style={style.sectionOneTouchText}>Shop Now</Text>
              </TouchableOpacity>
            </ImageBackground>
          ))}
        </ScrollView>
        {/* section two */}
        {recentProducts.length > 0 ? (
          <View style={style.sectionTwoView}>
            <Text style={style.sectionTwoHeadText}>
              Buy from Recently Bought
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentProducts.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleGoToProductDetails(item)}
                    key={index}
                    style={style.sectionTwoImgView}>
                    <Image
                      style={style.sectionTwoImg}
                      source={
                        item.image === ''
                          ? require('../../assets/images/fruit.png')
                          : {uri: item.image}
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* section three */}
        <View style={{margin: 15}}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Lato-Regular',
              textAlign: 'center',
            }}>
            Shop by Category
          </Text>

          <FlatList
            data={categories}
            numColumns={4}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 15,
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => handleGotoProducts(item, 'category')}
                  style={{
                    width: width * 0.2,
                    overflow: 'hidden',
                    marginHorizontal: 5,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      padding: 5,
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
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Image
                      style={{
                        width: width * 0.1,
                        height: width * 0.175,
                        resizeMode: 'contain',
                      }}
                      source={
                        item.image !== ''
                          ? {uri: item.image}
                          : require('../../assets/images/olive-oil.png')
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'Lato-Regular',
                      textAlign: 'center',
                    }}>
                    {item.name !== '' ? item.name : 'Oils, Refined & Ghee'}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* Newly Added */}
        <View
          style={{width: width, padding: 15, backgroundColor: colors.white}}>
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
                  color: 'black',
                  fontFamily: 'Lato-Bold',
                }}>
                Newly Added
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Lato-Regular',
                  textAlign: 'center',
                }}>
                Pay less, Get more.
              </Text>
            </View>
            <Text
              onPress={() => handleGotoProducts({}, 'all')}
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Lato-Regular',
              }}>
              See All
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {productDetail: item})
                  }
                  key={index}
                  style={{
                    borderRadius: 10,
                    borderColor: colors.lightGreen,
                    borderWidth: 1,
                    marginVertical: 15,
                    marginHorizontal: 5,
                    padding: 15,
                    width: width * 0.35,
                  }}>
                  <TouchableOpacity onPress={() => addToWishlist(item)}>
                    <Image
                      style={{width: 20, height: 20, alignSelf: 'flex-end'}}
                      source={
                        whishlistIds.includes(item.id)
                          ? require('../../assets/images/whishRed.png')
                          : require('../../assets/images/wishlist.png')
                      }
                    />
                  </TouchableOpacity>
                  <Image
                    style={{
                      width: width * 0.15,
                      height: width * 0.15,
                      alignSelf: 'center',
                    }}
                    source={
                      item.image === ''
                        ? require('../../assets/images/fruit.png')
                        : {uri: item.image}
                    }
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'Lato-Bold',
                      color: colors.black,
                      fontSize: 18,
                      marginTop: 10,
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
                      marginVertical: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.black,
                        fontFamily: 'Lato-Regular',
                      }}>
                      ₹{item.price}
                    </Text>
                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      style={{
                        padding: 5,
                        backgroundColor: colors.lightGreen,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.white,
                          fontFamily: 'Lato-Black',
                        }}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* section four */}
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

        {/* browse all */}
        <View style={{margin: 25}}>
          <Text
            style={{
              fontFamily: 'Lato-Black',
              color: 'rgba(98, 99, 98, 0.5)',
              fontSize: 20,
            }}>
            Didn't find what you are looking for?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Categories')}
            style={{
              width: width * 0.4,
              padding: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.primaryGreen,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                color: colors.white,
                fontSize: 16,
              }}>
              Browse Category
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
