import React, {useContext, useState, useCallback, useEffect} from 'react';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {colors} from '../common/colors';
import {AuthContext} from '../common/context';
import CustomButton from '../Components/CustomButton';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';

const Cart = () => {
  const {width, height} = Dimensions.get('screen');
  const [cart, setCart] = useState([]);
  const {token} = useSelector(state => state);
  const {updateCartCountContext} = useContext(AuthContext);
  const navigation = useNavigation();
  const [cartTotal, setCartTotal] = useState(0);
  const [delCharge, setDelCharge] = useState(50);
  const [userDetails, setUserDetails] = useState({});
  const [position, setPosition] = useState({
    latitude: 37.421998333333335,
    longitude: -122.08400000000002,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useFocusEffect(
    useCallback(() => {
      setCart([]);
      setCartTotal(0);
      getCartList();
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'always',
      locationProvider: 'playServices',
    });

    Geolocation.requestAuthorization(
      (success = () => {
        Geolocation.getCurrentPosition(info => {
          const pos = info?.coords;
          const ASPECT_RATIO = width / height;
          const LATITUDE_DELTA = 0.0922;
          const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
          setPosition({
            latitude: pos?.latitude,
            longitude: pos?.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        });
      }),
      (error = error => console.log(JSON.stringify(error))),
    );
  }, []);

  const getCartList = async () => {
    await firestore()
      .collection('Cart')
      .where('userId', '==', token)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('empty');
        } else {
          let totalPrice = 0;
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              const itemPrice = parseFloat(document?.data().price);
              totalPrice = parseFloat(itemPrice + totalPrice);
              objectsArray.push(result);
            }
          });
          setCartTotal(parseFloat(totalPrice));
          updateCartCountContext({cartCount: objectsArray.length});
          setCart(objectsArray);
        }
      });
  };

  const handleRemoveItem = async item => {
    if (item.quantity === 1) {
      await firestore()
        .collection('Cart')
        .doc(item.id)
        .delete()
        .then(() => {
          const filteredCart = cart.filter(element => element.id !== item.id);
          const itemPrice = parseFloat(item.price);
          setCartTotal(cartTotal - itemPrice);
          updateCartCountContext({cartCount: filteredCart.length});
          setCart(filteredCart);
          Snackbar.show({
            text: 'Product Removed!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
        });
    } else if (item.quantity > 1) {
      firestore()
        .collection('Products')
        .doc(item.productId)
        .onSnapshot(documentSnapshot => {
          const productData = documentSnapshot.data();
          firestore()
            .collection('Cart')
            .doc(item.id)
            .update({
              quantity: parseInt(item.quantity) - 1,
              price: parseFloat(item.price) - parseFloat(productData.price),
            })
            .then(() => {
              const upd_obj = cart.map(obj => {
                if (obj.id == item.id) {
                  obj.quantity = parseInt(item.quantity) - 1;
                  obj.price =
                    parseFloat(item.price) - parseFloat(productData.price);
                }
                return obj;
              });
              setCartTotal(cartTotal - item.price);
              updateCartCountContext({cartCount: upd_obj.length});
              setCart(upd_obj);
              Snackbar.show({
                text: 'Your Cart is updated!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
            });
        });
    }
  };

  const handleAddItem = async item => {
    firestore()
      .collection('Products')
      .doc(item.productId)
      .onSnapshot(async documentSnapshot => {
        const productData = documentSnapshot.data();
        await firestore()
          .collection('Cart')
          .doc(item.id)
          .update({
            quantity: parseInt(item.quantity) + 1,
            price: parseFloat(item.price) + parseFloat(productData.price),
          })
          .then(() => {
            const upd_obj = cart.map(obj => {
              if (obj.id == item.id) {
                obj.quantity = parseInt(item.quantity) + 1;
                obj.price =
                  parseFloat(item.price) + parseFloat(productData.price);
              }
              return obj;
            });
            setCartTotal(cartTotal + parseFloat(productData.price));
            updateCartCountContext({cartCount: upd_obj.length});
            setCart(upd_obj);
            Snackbar.show({
              text: 'Your Cart is updated!',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.primaryGreen,
              textColor: colors.white,
            });
          });
      });
  };

  const handleCartSubmit = () => {
    if (token !== 'nKCppQLqdgnmCRfGS1Pq') {
      if (cart.length > 0) {
        firestore()
          .collection('Users')
          .doc(token)
          .onSnapshot(documentSnapshot => {
            const userDetailsObj = documentSnapshot.data();
            setUserDetails(userDetailsObj);
            if (
              userDetailsObj.email !== undefined &&
              userDetailsObj.email !== '' &&
              userDetailsObj.email !== null &&
              userDetailsObj.phone !== undefined &&
              userDetailsObj.phone !== '' &&
              userDetailsObj.phone !== null
            ) {
              navigation.navigate('AddAddress', {
                totalPrice: cartTotal + delCharge,
                cartItems: cart,
                position: position,
                userDetails: userDetails,
              });
            } else {
              Snackbar.show({
                text: 'Update your profile to continue purchase!',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.red,
                textColor: colors.white,
              });
              navigation.navigate('Account');
            }
          });
      } else {
        Snackbar.show({
          text: 'Your Cart is empty!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
          textColor: colors.white,
        });
      }
    } else {
      Snackbar.show({
        text: 'You have no permission to proceed!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  const handleDeleteItem = async item => {
    await firestore()
      .collection('Cart')
      .doc(item.id)
      .delete()
      .then(() => {
        const filteredCart = cart.filter(element => element.id !== item.id);
        const itemPrice = parseFloat(item.price);
        setCartTotal(cartTotal - itemPrice);
        updateCartCountContext({cartCount: filteredCart.length});
        setCart(filteredCart);
        Snackbar.show({
          text: 'Product Removed!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.primaryGreen,
          textColor: colors.white,
        });
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader drawer={false} back={true} logo={false} head={'Cart'} />
      <FlatList
        data={cart}
        showsVerticalScrollIndicator={false}
        style={style.flatStyle}
        contentContainerStyle={style.trendingProView}
        renderItem={({item, index}) => {
          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              key={index}
              style={style.scrollStyle}>
              <View style={style.scrollContainerStyle}>
                <View style={style.trendingProImgView}>
                  <Image
                    style={style.trendingProImg}
                    source={
                      item.image === ''
                        ? require('../../assets/images/fruit.png')
                        : {uri: item.image}
                    }
                  />
                </View>
                <View style={style.scrollBlock}>
                  <Text numberOfLines={2} style={style.itemName}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={2} style={style.itemDesc}>
                    {item.description}
                  </Text>
                  <View style={style.priceView}>
                    <Text style={style.priceText}>₹{item.price}</Text>
                    <View style={style.discountView}>
                      <Text style={style.discountText}>50% OFF</Text>
                    </View>
                    <View style={style.removeView}>
                      <Text
                        onPress={() => handleRemoveItem(item)}
                        style={style.removeText}>
                        _
                      </Text>
                      <Text style={style.removeQuantity}>{item.quantity}</Text>
                      <Text
                        onPress={() => handleAddItem(item)}
                        style={style.removeAdd}>
                        +
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteItem(item)}
                style={style.deleteTouch}>
                <Image
                  style={style.deleteIcon}
                  source={require('../../assets/images/delete-white.png')}
                />
              </TouchableOpacity>
            </ScrollView>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={style.emptyView}>
              <Image
                source={require('../../assets/images/empty-cart.png')}
                style={style.emptyCart}
              />
              <Text style={style.emptyText}>Your Cart is empty</Text>
              <CustomButton
                buttonText={'See All Products'}
                type={'basic'}
                onClickButton={() =>
                  navigation.navigate('Products', {
                    categoryData: {},
                    type: 'all',
                  })
                }
              />
            </View>
          );
        }}
        ListFooterComponent={() => {
          if (cart.length > 0) {
            return (
              <>
                {/* coupun */}
                <View style={style.couponView}>
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
                      50
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
                      On your first order
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        fontSize: 12,
                        color: colors.placeholder,
                      }}>
                      On order above ₹25.00
                    </Text>
                  </View>
                  <View>
                    <View
                      style={[
                        style.coupunEdge,
                        {position: 'absolute', top: -10},
                      ]}
                    />
                    <View
                      style={[
                        style.coupunEdge,
                        {position: 'absolute', bottom: -10},
                      ]}
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
                        padding: 8,
                        backgroundColor: colors.primaryGreen,
                        borderRadius: 15,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Regular',
                          fontSize: 15,
                          color: colors.white,
                        }}>
                        SDC450
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

                {/* order details */}
                <View style={{margin: 20}}>
                  <Text style={style.orderDetailsHeadText}>Order Details</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={style.orderDetailsText}>Bag Total</Text>
                      <Text style={style.orderDetailsText}>Bag Savings</Text>
                      <Text style={style.orderDetailsText}>
                        Coupon Discount
                      </Text>
                      <Text style={style.orderDetailsText}>Delivery</Text>
                    </View>
                    <View>
                      <Text
                        style={[style.orderDetailsText, {textAlign: 'right'}]}>
                        ₹{cartTotal}
                      </Text>
                      <Text
                        style={[
                          style.orderDetailsText,
                          {color: colors.primaryGreen, textAlign: 'right'},
                        ]}>
                        ₹-00.00
                      </Text>
                      <Text
                        style={[
                          style.orderDetailsText,
                          {color: colors.red, textAlign: 'right'},
                        ]}>
                        Apply Coupon
                      </Text>
                      <Text
                        style={[style.orderDetailsText, {textAlign: 'right'}]}>
                        ₹{delCharge}
                      </Text>
                    </View>
                  </View>
                  <View style={style.totalView}>
                    <Text
                      style={[
                        style.orderDetailsText,
                        {color: colors.black, fontFamily: 'Lato-Bold'},
                      ]}>
                      Total Amount
                    </Text>
                    <Text
                      style={[
                        style.orderDetailsText,
                        {
                          color: colors.black,
                          fontFamily: 'Lato-Bold',
                          textAlign: 'right',
                        },
                      ]}>
                      ₹{cartTotal + delCharge}
                    </Text>
                  </View>

                  <CustomButton
                    buttonText={'Proceed to Checkout'}
                    type={'basic'}
                    onClickButton={handleCartSubmit}
                  />
                </View>
              </>
            );
          } else {
            return null;
          }
        }}
      />
    </View>
  );
};

export default Cart;
