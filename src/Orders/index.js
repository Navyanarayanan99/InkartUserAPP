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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {colors} from '../common/colors';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Orders = () => {
  const {height, width} = Dimensions.get('screen');
  const navigation = useNavigation();
  const {token} = useSelector(state => state);
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getOrderList();
      return () => {
        console.log('Screen was unfocused');
      };
    }, []),
  );

  const getOrderList = async () => {
    await firestore()
      .collection('Orders')
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
          setOrders(objectsArray);
        }
      });
  };

  const handleSearch = async text => {
    await firestore()
      .collection('Orders')
      .where('userId', '==', token)
      .orderBy('userPhone')
      .startAt(text)
      .endAt(text + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setOrders([]);
        } else {
          const objectsArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objectsArray.push(result);
            }
          });
          setOrders(objectsArray);
        }
      });
  };

  return (
    <View style={style.container}>
      <CustomHeader drawer={false} back={true} logo={false} head={'Orders'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke}}>
        {/* top filter */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: 'rgba(98,179,99,0.1)',
            paddingVertical: 15,
          }}>
          <Text style={style.activeFilterText}>Processing</Text>
          <Text style={style.inactiveFilterText}>Last 30 Days</Text>
          <Text style={style.inactiveFilterText}>February</Text>
          <Text style={style.inactiveFilterText}>January</Text>
        </View>
        {/* search */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <Text
            style={{
              color: colors.primaryGreen,
              fontFamily: 'Lato-Regular',
              fontSize: 18,
            }}>
            Filter
          </Text>
        </View>
        {/* orders */}
        <View style={{marginHorizontal: 20}}>
          {orders &&
            orders.map((item, index) => {
              const dateFormat = moment(new Date(item.created)).format(
                'DD/MM/YY, h:mm a',
              );
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OrderDetails', {order: item})
                  }
                  key={index}
                  style={{
                    backgroundColor: '#f0f8ff',
                    borderRadius: 15,
                    padding: 12,
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Lato-Regular',
                          color: colors.black,
                          fontSize: 15,
                        }}>
                        ID: #{item.orderId}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Regular',
                          color: colors.primaryGreen,
                          fontSize: 13,
                        }}>
                        Ordered On: {dateFormat}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Regular',
                          color: colors.placeholder,
                          fontSize: 14,
                          width: width * 0.6,
                        }}
                        numberOfLines={3}>
                        {item.address}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Regular',
                          color: colors.black,
                          fontSize: 16,
                        }}>
                        Paid:{' '}
                        <Text
                          style={{
                            fontFamily: 'Lato-Regular',
                            color: colors.primaryGreen,
                          }}>
                          ₹{item?.totalAmount}
                        </Text>
                        , Items:{' '}
                        <Text
                          style={{
                            fontFamily: 'Lato-Regular',
                            color: colors.primaryGreen,
                          }}>
                          {item?.cartItems.length}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        overflow: 'hidden',
                        borderRadius: 15,
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{
                          width: width * 0.2,
                          height: width * 0.2,
                          resizeMode: 'stretch',
                        }}
                        source={require('../../assets/images/map.webp')}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      paddingTop: 15,
                      borderTopWidth: 1,
                      borderTopColor: colors.borderGrey,
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        color: colors.black,
                        fontSize: 13,
                      }}>
                      {item.orderStatus}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Regular',
                        color: colors.placeholder,
                        fontSize: 13,
                      }}>
                      Rate & Review Product
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Orders;
