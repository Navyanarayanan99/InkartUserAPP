import React, {useContext, useState, useEffect, useRef} from 'react';
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
import {AuthContext} from '../common/context';
import CustomButton from '../Components/CustomButton';
import CustomHeader from '../Components/CustomHeader';
import {style} from './style';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import RazorpayCheckout from 'react-native-razorpay';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useSelector} from 'react-redux';
navigator.geolocation = require('@react-native-community/geolocation');

const AddAddress = props => {
  const {totalPrice, position, cartItems, userDetails} = props.route.params;
  const {width, height} = Dimensions.get('screen');
  const {token} = useSelector(state => state);
  const {updateCartCountContext} = useContext(AuthContext);
  const navigation = useNavigation();
  const [address, setAdress] = useState('');
  const [checked, setChecked] = useState('');
  const [newPosition, setNewPosition] = useState(position);
  const ref = useRef();

  useEffect(() => {
    setNewPosition(position);
  }, []);

  const getCurrentAdress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        newPosition.latitude +
        ',' +
        newPosition.longitude +
        '&key=' +
        'AIzaSyCkaHMlRjNoS8Rdt0aRKuMAE4gk1QiGy-4',
    )
      .then(response => response.json())
      .then(responseJson => {
        const fullAddress = responseJson.results[0].formatted_address;
        setAdress(fullAddress);
        setChecked('curLocation');
      });
  };

  const handleSuccessPayment = async id => {
    try {
      const small_id = id.slice(4, 12);
      await firestore()
        .collection('Orders')
        .add({
          orderId: small_id.toString().toUpperCase(),
          created: Date.now(),
          updated: Date.now(),
          orderStatus: 'Ordered',
          totalAmount: totalPrice,
          address: address,
          userId: token,
          paymentMethod: 'online',
          cartItems: cartItems,
          userName: userDetails?.username,
          userEmail: userDetails?.email,
          userPhone: userDetails?.phone,
          expDelDate: Date.now(),
        })
        .then(async resp => {
          await firestore()
            .collection('Cart')
            .where('userId', '==', token)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref
                  .delete()
                  .then(() => {
                    navigation.goBack();
                    updateCartCountContext({cartCount: 0});
                  })
                  .catch(function (error) {
                    console.log('Error removing document: ', error);
                  });
              });
            });
          Snackbar.show({
            text: 'Order Placed Successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
        });
    } catch (error) {}
  };

  const handleContinue = () => {
    if (address !== '' && checked === 'curLocation') {
      var options = {
        description: 'Credits towards purchase',
        image:
          'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
        currency: 'INR',
        key: 'rzp_test_CXo5HbmQ83IYL0',
        amount: parseFloat(totalPrice) * 100,
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
          handleSuccessPayment(data?.razorpay_payment_id);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Snackbar.show({
        text: 'Select an address to continue',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  return (
    <View style={style.container}>
      <CustomHeader
        drawer={false}
        back={true}
        logo={false}
        head={'Add Address'}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={{padding: 15}}>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search Location"
              currentLocation={true}
              currentLocationLabel="Current location"
              fetchDetails={true}
              onPress={(data, details) => {
                const location =
                  data?.geometry?.location ?? details.geometry?.location;
                const positionData = {
                  latitude: location?.lat ?? 0,
                  longitude: location?.lng ?? 0,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                };
                setNewPosition(positionData);
                setAdress(data?.name ?? data?.description);
              }}
              query={{
                key: 'AIzaSyCkaHMlRjNoS8Rdt0aRKuMAE4gk1QiGy-4',
                language: 'en',
              }}
              styles={{
                textInput: style.textInput,
                predefinedPlacesDescription: style.description,
              }}
            />
          </View>
          <MapView
            style={style.mapView}
            customMapStyle={[
              {
                featureType: 'landscape.man_made',
                elementType: 'labels.icon',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
              {
                featureType: 'poi.attraction',
                elementType: 'labels.icon',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
              {
                featureType: 'poi.business',
                elementType: 'labels.icon',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
              {
                featureType: 'poi.business',
                elementType: 'labels.text',
                stylers: [
                  {
                    visibility: 'on',
                  },
                ],
              },
              {
                featureType: 'poi.government',
                elementType: 'labels.icon',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
            ]}
            initialRegion={newPosition}
            region={newPosition}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}>
            <Marker
              title="Yor are here"
              description="This is a description"
              coordinate={newPosition}
            />
          </MapView>
        </View>
        <View style={style.addressView}>
          <TouchableOpacity
            onPress={getCurrentAdress}
            style={style.addressTouch}>
            <Image
              source={require('../../assets/images/paper-plane.png')}
              style={style.paperPlaneImage}
            />
            <Text style={style.currentLocText}>Your Current location</Text>
          </TouchableOpacity>
          <View style={style.commonPadding}>
            {address !== '' ? (
              <View style={style.addressContainer}>
                <View>
                  <View style={style.imageView}>
                    <Image
                      source={require('../../assets/images/location.png')}
                      style={style.locationImage}
                    />
                    <Text style={style.addressText}>
                      {address.split(',')[0]}
                    </Text>
                  </View>
                  <Text style={style.addressSubText}>
                    {address.split(',').slice(1).join(', ') ?? ''}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      setChecked(checked === 'curLocation' ? '' : 'curLocation')
                    }
                    style={style.touchView}>
                    {checked === 'curLocation' ? (
                      <View style={style.locationView}></View>
                    ) : null}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          <CustomButton
            buttonText={'Confirm location & Proceed'}
            type={'basic'}
            onClickButton={handleContinue}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddAddress;
