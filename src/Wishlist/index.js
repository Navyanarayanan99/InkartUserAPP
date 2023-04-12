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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateWishlistIds} from '../../storage/action';

const Wishlist = () => {
  const {width, height} = Dimensions.get('screen');
  const [wishlist, setWishlist] = useState([]);
  const {token, cartCount} = useSelector(state => state);
  const {updateCartCountContext} = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getWishList();
      getWishlistIds();
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

  const getWishList = async () => {
    await firestore()
      .collection('Wishlist')
      .where('userId', '==', token)
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
          setWishlist(objectsArray);
        }
      });
  };

  const handleRemoveItem = async item => {
    await firestore()
      .collection('Wishlist')
      .doc(item.id)
      .delete()
      .then(() => {
        const filteredWishlist = wishlist.filter(
          element => element.id !== item.id,
        );
        setWishlist(filteredWishlist);
        Snackbar.show({
          text: 'Product Removed!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.primaryGreen,
          textColor: colors.white,
        });
      });
  };

  const handleAddItem = async item => {
    await firestore()
      .collection('Cart')
      .where('productId', '==', item.productId)
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
              productId: item.productId,
              quantity: 1,
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

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'My Wishlist'}
        cart={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke}}>
        {/* product list */}
        <View style={style.trendingProView}>
          {wishlist.map((item, index) => (
            <View key={index} style={style.trendingProItemView}>
              <TouchableOpacity
                onPress={() => handleGoToProductDetails(item)}
                style={style.trendingProImgView}>
                <Image
                  style={style.trendingProImg}
                  source={
                    item.image === ''
                      ? require('../../assets/images/fruit.png')
                      : {uri: item.image}
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  position: 'absolute',
                  right: -5,
                  top: -5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.red,
                }}>
                <Image
                  style={{width: 15, height: 15, resizeMode: 'cover'}}
                  source={require('../../assets/images/delete-white.png')}
                />
              </TouchableOpacity>

              <View style={{width: width * 0.55}}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Lato-Regular',
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
                      fontSize: 15,
                      color: 'black',
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
                        fontSize: 12,
                        color: colors.white,
                        fontFamily: 'Lato-Regular',
                      }}>
                      50% OFF
                    </Text>
                  </View>
                  <View
                    style={{
                      borderColor: colors.primaryGreen,
                      borderWidth: 1,
                      padding: 5,
                      justifyContent: 'center',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: width * 0.22,
                    }}>
                    <Text
                      onPress={() => handleAddItem(item)}
                      style={{
                        fontSize: 12,
                        color: colors.primaryGreen,
                        fontFamily: 'Lato-Bold',
                      }}>
                      Add to Cart
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Wishlist;
