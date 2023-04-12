import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  ScrollView,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../common/colors';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {AppContext, AuthContext} from '../common/context';
import Collapsible from 'react-native-collapsible';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState(false);
  const {height, width} = Dimensions.get('screen');
  const {updateCategoriesContext} = useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearch(false);
        setSearchResults([]);
      };
    }, []),
  );

  useEffect(() => {
    getCatList();
  }, []);

  const getCatList = async () => {
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
          setSelectedCategory(objectsArray.length > 0 ? objectsArray[0] : {});
          if (objectsArray.length > 0) {
            getProducts(objectsArray[0]);
          }
          setCategories(objectsArray);
        }
      });
  };

  const handleSelectedCategory = (item, index) => {
    setSelectedCategory(item);
    setSelectedIndex(index);
    getProducts(item);
  };

  const getProducts = async item => {
    await firestore()
      .collection('Products')
      .where('categoryId', '==', item.id)
      .limit(6)
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

  const handleSearch = async text => {
    await firestore()
      .collection('Categories')
      .orderBy('name')
      .startAt(text)
      .endAt(text + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setSearch(false);
        } else {
          setSearch(true);
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setSearchResults(objectsArray);
        }
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Categories'}
      />
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
              onChangeText={text => handleSearch(text)}
            />
          </View>
          <Image
            style={style.searchContainerImageMike}
            source={require('../../assets/images/voice.png')}
          />
        </View>
        <Collapsible collapsed={search}>
          <FlatList
            numColumns={3}
            data={searchResults}
            extraData={searchResults}
            contentContainerStyle={{
              margin: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => handleSelectedCategory(item, index)}
                  style={{
                    padding: 15,
                  }}>
                  <Image
                    style={{width: width * 0.17, height: width * 0.17}}
                    source={{uri: item.image}}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      fontFamily: 'Lato-Bold',
                      marginLeft: 10,
                    }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Collapsible>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* coloumn one */}
          <View
            style={{
              width: width * 0.3,
              backgroundColor: colors.secondaryGreen,
            }}>
            <FlatList
              data={categories}
              extraData={categories}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => handleSelectedCategory(item, index)}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderGrey,
                    padding: 15,
                    backgroundColor:
                      selectedIndex === index ? '#fff5ee' : 'transparent',
                  }}>
                  <Image
                    style={{width: width * 0.17, height: width * 0.17}}
                    source={{uri: item.image}}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          {/* coloumn two */}
          <View style={{width: width * 0.7}}>
            <ImageBackground
              style={{
                width: width * 0.6,
                height: width * 0.4,
                resizeMode: 'cover',
                borderRadius: 15,
                overflow: 'hidden',
                margin: 15,
                justifyContent: 'center',
              }}
              source={require('../../assets/images/home1bg.jpg')}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'Lato-Bold',
                  marginLeft: 10,
                }}>
                {selectedCategory.name ?? 'Fresh Veges'}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.placeholder,
                  fontFamily: 'Lato-Regular',
                  marginLeft: 10,
                }}>
                Get Instant Delivery
              </Text>
            </ImageBackground>
            <FlatList
              numColumns={3}
              data={products}
              contentContainerStyle={{
                margin: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProductDetails', {
                        productDetail: item,
                      })
                    }
                    style={{
                      width: width * 0.19,
                      overflow: 'hidden',
                      marginRight: 10,
                    }}>
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: colors.secondaryGreen,
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
                          item?.image !== ''
                            ? {uri: item.image}
                            : require('../../assets/images/olive-oil.png')
                        }
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black,
                        fontFamily: 'Lato-Bold',
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.placeholder,
                        fontFamily: 'Lato-Regular',
                        textAlign: 'center',
                      }}>
                      ₹{item.price}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Products', {
                  categoryData: selectedCategory,
                  type: 'category',
                })
              }
              style={{
                width: width * 0.4,
                padding: 10,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.primaryGreen,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: colors.white,
                  fontSize: 14,
                }}>
                Browse All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;
