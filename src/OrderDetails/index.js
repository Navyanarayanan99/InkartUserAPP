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
import {useNavigation} from '@react-navigation/native';
import {colors} from '../common/colors';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import CustomButton from '../Components/CustomButton';

const OrderDetails = props => {
  const {height, width} = Dimensions.get('screen');
  const order = props.route.params.order;
  const navigation = useNavigation();
  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Order Summary'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.whitesmoke, padding: 15}}>
        {/* order section one */}
        <View
          style={{
            backgroundColor: colors.primaryGreen,
            borderRadius: 15,
            padding: 20,
            paddingVertical: 25,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 40, height: 40, marginRight: 20}}
            source={require('../../assets/images/parcel-white.png')}
          />
          <View>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 16,
                color: colors.white,
              }}>
              Order ID: #{order?.orderId}
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Black',
                fontSize: 20,
                color: colors.white,
              }}>
              {order.orderStatus}
            </Text>
          </View>
        </View>
        {/* order details */}
        <View style={{margin: 10}}>
          <Text
            style={{
              color: colors.primaryGreen,
              fontFamily: 'Lato-Bold',
              fontSize: 17,
              marginVertical: 15,
            }}>
            Items:
          </Text>
          {order &&
            order?.cartItems.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      width: width * 0.1,
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.primaryGreen,
                        padding: 10,
                        borderRadius: 6,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontFamily: 'Lato-Regular',
                          fontSize: 16,
                          textAlign: 'center',
                        }}>
                        {item?.quantity}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 40,
                      marginBottom: -10,
                      marginHorizontal: 10,
                    }}>
                    *
                  </Text>
                  <View
                    style={{
                      width: width * 0.45,
                    }}>
                    <Text
                      style={{
                        color: colors.black,
                        fontFamily: 'Lato-Regular',
                        fontSize: 15,
                      }}>
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.placeholder,
                        fontFamily: 'Lato-Regular',
                        fontSize: 13,
                      }}>
                      {item?.description}
                    </Text>
                  </View>
                  <Text
                    style={{
                      width: width * 0.15,
                      color: colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 16,
                      marginLeft: 15,
                      textAlign: 'right',
                    }}>
                    ₹{item?.price}
                  </Text>
                </View>
              );
            })}
        </View>
        {/* payment details */}
        <View style={{margin: 10}}>
          <Text style={style.orderDetailsHeadText}>Payment Details</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={style.orderDetailsText}>Bag Total</Text>
              <Text style={style.orderDetailsText}>Coupon Discount</Text>
              <Text style={style.orderDetailsText}>Delivery</Text>
            </View>
            <View>
              <Text style={[style.orderDetailsText, {textAlign: 'right'}]}>
                ₹{parseFloat(order.totalAmount) - 50}
              </Text>
              <Text
                style={[
                  style.orderDetailsText,
                  {color: colors.red, textAlign: 'right'},
                ]}>
                Apply Coupon
              </Text>
              <Text style={[style.orderDetailsText, {textAlign: 'right'}]}>
                ₹50.00
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopColor: colors.borderGrey,
              borderTopWidth: 1,
              paddingTop: 15,
              marginVertical: 20,
            }}>
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
              ₹{order.totalAmount}
            </Text>
          </View>
        </View>
        {/* addresse */}
        <View style={{margin: 10}}>
          <Text style={style.orderDetailsHeadText}>Address</Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              color: colors.black,
              fontSize: 16,
            }}>
            {order.userName}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              color: colors.placeholder,
              fontSize: 14,
            }}>
            {order.userPhone}, {order.userEmail}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              color: colors.placeholder,
              fontSize: 14,
            }}>
            {order.address}
          </Text>
        </View>

        {/* payment method */}
        <View style={{margin: 10, marginBottom: 30}}>
          <Text style={style.orderDetailsHeadText}>Payment Method</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 40, height: 40, marginRight: 10}}
              source={require('../../assets/images/visa.png')}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: colors.black,
                  fontSize: 15,
                }}>
                **** **** **** 7689
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: colors.black,
                  fontSize: 15,
                }}>
                {order.paymentMethod}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <CustomButton
          buttonText={'Reorder'}
          type={'basic'}
          onClickButton={() => console.log('hai')}
        />
      </View>
    </View>
  );
};

export default OrderDetails;
