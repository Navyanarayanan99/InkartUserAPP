import React from 'react';
import {Text, TouchableHighlight, View, ScrollView} from 'react-native';
import {colors} from '../common/colors';
import RazorpayCheckout from 'react-native-razorpay';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';

const AddPayment = () => {
  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Add Payment Method'}
      />
      <View
        style={{
          backgroundColor: colors.whitesmoke,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          overflow: 'hidden',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableHighlight
            onPress={() => {
              var options = {
                description: 'Credits towards consultation',
                image:
                  'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
                currency: 'INR',
                key: 'rzp_test_CXo5HbmQ83IYL0', // Your api key
                amount: '5000',
                name: 'InKart Checkout',
                prefill: {
                  email: 'void@razorpay.com',
                  contact: '9191919191',
                  name: 'Razorpay Software',
                },
                theme: {color: colors.red},
              };
              RazorpayCheckout.open(options)
                .then(data => {
                  // handle success
                  alert(`Success: ${data.razorpay_payment_id}`);
                })
                .catch(error => {
                  // handle failure
                  alert(`Error: ${error.code} | ${error.description}`);
                });
            }}>
            <Text>Credits towards consultation</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddPayment;
