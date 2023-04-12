import React, {useContext, useState, useCallback} from 'react';
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
import StarRating from 'react-native-star-rating';

const ProductDetails = props => {
  const productDetail = props.route.params.productDetail;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, height} = Dimensions.get('screen');
  const {token, whishlistIds, cartCount} = useSelector(state => state);
  const [products, setProducts] = useState([]);
  const [activeSections, setActiveSections] = useState([0]);
  const {updateCartCountContext} = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const SECTIONS = [
    {
      title: 'Manufacturer Details',
      content:
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      title: 'Product Disclaimer',
      content:
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      title: 'Features & Details',
      content:
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      getProductList();
      getReviews(productDetail?.id);
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
          Snackbar.show({
            text: 'Item is in your Wishlist!',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
        }
      });
  };

  const getProductList = async () => {
    await firestore()
      .collection('Products')
      .where('categoryId', '==', productDetail.categoryId)
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

  const addToCart = async (item, isCurrentProduct) => {
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
              price: isCurrentProduct
                ? parseFloat(item.price) * quantity
                : item.price,
              productId: item.id,
              quantity: isCurrentProduct ? quantity : 1,
              userId: token,
              image: item.image,
            })
            .then(resp => {
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
              quantity: isCurrentProduct
                ? parseInt(snapshot?.docs[0].data().quantity) + quantity
                : parseInt(snapshot?.docs[0].data().quantity) + 1,
              price: isCurrentProduct
                ? parseFloat(snapshot?.docs[0].data().price) +
                  parseFloat(item.price) * quantity
                : parseFloat(snapshot?.docs[0].data().price) +
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

  _renderHeader = section => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: colors.black,
            fontFamily: 'Lato-Bold',
            fontSize: 16,
            marginVertical: 5,
          }}>
          {section.title}
        </Text>
        <Image
          style={{
            width: 20,
            height: 20,
            resizeMode: 'cover',
            marginRight: 10,
          }}
          source={require('../../assets/images/down-arrow2.png')}
        />
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View>
        <Text
          style={{
            color: colors.placeholder,
            fontFamily: 'Lato-Regular',
            fontSize: 14,
          }}>
          {section.content}
        </Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  const handleShare = () => {};

  const handleGotoProducts = (data, type) => {
    if (type === 'category') {
      navigation.navigate('Products', {categoryData: data, type: 'category'});
    } else if (type === 'all') {
      navigation.navigate('Products', {categoryData: {}, type: 'all'});
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        share={true}
        handleShare={handleShare}
        cart={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke}}>
        <View style={{padding: 15, backgroundColor: colors.whitesmoke}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              top: 20,
            }}
            onPress={() => addToWishlist(productDetail)}>
            <Image
              style={{width: 30, height: 30, alignSelf: 'flex-end'}}
              source={
                whishlistIds.includes(productDetail.id)
                  ? require('../../assets/images/whishRed.png')
                  : require('../../assets/images/wishlist.png')
              }
            />
          </TouchableOpacity>
          <Image
            style={{
              width: width * 0.6,
              height: width * 0.6,
              resizeMode: 'cover',
              alignSelf: 'center',
            }}
            source={{uri: productDetail.image}}
          />
        </View>
        <View
          style={{
            padding: 15,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <Text
            style={{
              color: colors.black,
              fontFamily: 'Lato-Bold',
              fontSize: 18,
            }}>
            {productDetail.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
            }}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={4}
              fullStarColor={'#ffd700'}
              starStyle={{fontSize: 25}}
            />
            <Text
              style={{
                color: colors.placeholder,
                fontFamily: 'Lato-Regular',
                fontSize: 15,
                marginLeft: 10,
              }}>
              ({reviews.length} {reviews.length > 1 ? 'ratings' : 'rating'})
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: colors.black,
                fontFamily: 'Lato-Bold',
                fontSize: 17,
              }}>
              ₹{productDetail.price}
            </Text>
            <Text
              style={{
                color: colors.primaryGreen,
                fontFamily: 'Lato-Bold',
                fontSize: 17,
              }}>
              {'   '}25% off
            </Text>
          </View>
          {/* select boxes */}
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: width * 0.44,
                padding: 10,
                backgroundColor: colors.whitesmoke,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 15,
                  marginVertical: 5,
                }}>
                500 g/24.00
              </Text>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'cover',
                  marginRight: 10,
                }}
                source={require('../../assets/images/down-arrow2.png')}
              />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: width * 0.44,
                padding: 10,
                backgroundColor: colors.whitesmoke,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 15,
                  marginVertical: 5,
                }}>
                Delivery Time
              </Text>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'cover',
                  marginRight: 10,
                }}
                source={require('../../assets/images/down-arrow2.png')}
              />
            </View>
          </View>
          {/* description */}
          <View
            style={{
              borderBottomColor: colors.borderGrey,
              borderBottomWidth: 1,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: colors.black,
                fontFamily: 'Lato-Bold',
                fontSize: 16,
                marginBottom: 5,
              }}>
              Product Details
            </Text>
            <Text
              style={{
                color: colors.placeholder,
                fontFamily: 'Lato-Regular',
                fontSize: 13,
              }}>
              {productDetail.description}
            </Text>
          </View>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            underlayColor={'transparent'}
            sectionContainerStyle={{
              borderBottomColor: colors.borderGrey,
              borderBottomWidth: 1,
              paddingVertical: 10,
            }}
          />
          {/* review */}
          <View
            style={{
              paddingVertical: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 15,
                  marginVertical: 5,
                }}>
                Product Review ({reviews.length})
              </Text>
              <Text
                onPress={() =>
                  navigation.navigate('ProductReview', {
                    productId: productDetail.id,
                    categoryId: productDetail.categoryId,
                  })
                }
                style={{
                  color: colors.primaryGreen,
                  fontFamily: 'Lato-Regular',
                  fontSize: 14,
                  marginVertical: 5,
                  marginRight: 5,
                }}>
                {reviews.length > 0 ? 'See All' : 'Write a review'}
              </Text>
            </View>
            {reviews.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    marginVertical: 10,
                    padding: 20,
                    backgroundColor: colors.whitesmoke,
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
          </View>
          {/* delivery details */}
          <View>
            <Text
              style={{
                fontSize: 16,
                color: colors.black,
                fontFamily: 'Lato-Bold',
                marginBottom: 10,
              }}>
              Check Delievry
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.placeholder,
                fontFamily: 'Lato-Regular',
              }}>
              Enter pincode to check delivery date/pickup option.
            </Text>
            <CustomTextInput
              type={'icon-as-text'}
              onIconPress={() => console.warn('pressed')}
              iconText={'Check'}
              placeholder={'Pin Code'}
              onChange={text => console.log(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.placeholder,
                  fontFamily: 'Lato-Regular',
                }}>
                Free delivery on orders above 200.00
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.placeholder,
                  fontFamily: 'Lato-Regular',
                }}>
                Cash on delivery available.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.placeholder,
                  fontFamily: 'Lato-Regular',
                }}>
                Easy 21 days return and exchange.
              </Text>
            </View>
          </View>
        </View>

        {/* Newly Added */}
        <View
          style={{
            width: width,
            padding: 15,
            backgroundColor: colors.white,
            paddingBottom: 100,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Lato-Regular',
                }}>
                Newly Added
              </Text>
              <Text
                style={{
                  fontSize: 14,
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
            {products.map((item, index) => (
              <View
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
                      whishlistIds.includes(item?.id)
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
                    fontFamily: 'Lato-Regular',
                    color: colors.black,
                    fontSize: 12,
                    marginTop: 10,
                  }}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 14,
                    color: 'black',
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
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'Lato-Regular',
                    }}>
                    ₹{item.price}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item, false)}
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
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/* footer */}
      <View
        style={{
          backgroundColor: colors.primaryGreen,
          padding: 15,
          position: 'absolute',
          bottom: 25,
          left: 15,
          right: 15,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: colors.whitesmoke,
            padding: 5,
            width: width * 0.25,
          }}>
          <Text
            onPress={() =>
              quantity !== 0 ? setQuantity(quantity - 1) : setQuantity(0)
            }
            style={{
              fontSize: 18,
              color: colors.primaryGreen,
              fontFamily: 'Lato-Bold',
            }}>
            -
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: colors.primaryGreen,
              fontFamily: 'Lato-Bold',
            }}>
            {quantity}
          </Text>
          <Text
            onPress={() => setQuantity(quantity + 1)}
            style={{
              fontSize: 18,
              color: colors.primaryGreen,
              fontFamily: 'Lato-Bold',
            }}>
            +
          </Text>
        </View>
        <Text
          onPress={() => addToCart(productDetail, true)}
          style={{
            fontSize: 16,
            color: colors.white,
            fontFamily: 'Lato-Bold',
          }}>
          Add to Cart
        </Text>
      </View>
    </View>
  );
};

export default ProductDetails;
