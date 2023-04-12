import React, {useContext, useState, useCallback} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {colors} from '../common/colors';
import {AppContext, AuthContext} from '../common/context';
import CustomButton from '../Components/CustomButton';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Products = props => {
  const categoryData = props.route.params.categoryData;
  const type = props.route.params.type;
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('screen');
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState({});
  const [searchText, setSearchText] = useState('');
  const {token, categories} = useSelector(state => state);

  useFocusEffect(
    useCallback(() => {
      getProductList(categoryData, type);
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getProductList = async (data, listtype) => {
    if (listtype === 'category') {
      if (data?.id) {
        await firestore()
          .collection('Products')
          .where('categoryId', '==', data?.id)
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
      }
    } else if (listtype === 'all') {
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
    }
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

  const handleClickCategory = item => {
    setSelectedCat(item);
    getProductList(item, 'category');
  };

  const getStyle = id => {
    if (selectedCat?.id !== undefined) {
      if (selectedCat?.id === id) {
        return style.activeFilterText;
      } else {
        return style.inactiveFilterText;
      }
    } else {
      if (categoryData?.id === id) {
        return style.activeFilterText;
      } else {
        return style.inactiveFilterText;
      }
    }
  };

  const handleSearch = async txt => {
    await firestore()
      .collection('Products')
      .orderBy('name')
      .startAt(txt)
      .endAt(txt + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setProducts([]);
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {
                id: document.id,
                ...document?.data(),
              };
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
        head={
          type === 'all' && selectedCat?.name == undefined
            ? 'Shop'
            : selectedCat?.name ?? categoryData.name
        }
        cart={true}
      />
      <ScrollView>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{
            backgroundColor: 'rgba(98,179,99,0.1)',
          }}>
          {categories.map((item, index) => {
            return (
              <Text
                onPress={() => handleClickCategory(item)}
                key={index}
                style={getStyle(item.id)}>
                {item.name}
              </Text>
            );
          })}
        </ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10}}>
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
                value={searchText}
                placeholder="Search here.."
                placeholderTextColor={colors.placeholder}
                onChangeText={text => {
                  setSearchText(text);
                  handleSearch(text);
                }}
              />
            </View>
            <Image
              style={style.searchContainerImageMike}
              source={require('../../assets/images/voice.png')}
            />
          </View>
          <Text
            style={{
              color: colors.primaryGreen,
              fontFamily: 'Lato-Regular',
              fontSize: 18,
            }}>
            Filter
          </Text>
        </View>
        <FlatList
          data={products}
          extraData={products}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return <View style={{height: height * 0.2}} />;
          }}
          keyExtractor={item => item.id}
          style={{backgroundColor: colors.whitesmoke}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 15,
          }}
          renderItem={({item, index}) => {
            return (
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
            );
          }}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
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
        <View>
          <Text
            style={{
              fontSize: 14,
              color: colors.white,
              fontFamily: 'Lato-Regular',
            }}>
            2 Items
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.white,
              fontFamily: 'Lato-Bold',
            }}>
            ₹250.00
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: colors.white,
            fontFamily: 'Lato-Bold',
          }}>
          View Cart >
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Products;
