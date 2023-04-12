import React, {useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableLatestRenderer} from 'react-native-maps';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Home from '../Home';
import Categories from '../Categories';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Provider, useDispatch, useSelector} from 'react-redux';
import Splash from '../Splash';
import CustomDrawerContent from '../Components/CustomDrawerContent';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBarContent from '../Components/CustomTabBarContent';
import Account from '../Account';
import Offers from '../Offers';
import Cart from '../Cart';
import Search from '../Search';
import Orders from '../Orders';
import OrderDetails from '../OrderDetails';
import Products from '../Products';
import ProductDetails from '../ProductDetails';
import Wishlist from '../Wishlist';
import AddAddress from '../AddAdress';
import AddPayment from '../AddPayment';
import {AuthContext} from '../common/context';
import {
  handleLoading,
  login,
  signup,
  updateCartCount,
  updateCategories,
  signout,
  updateProfileImage,
} from '../../storage/action';
import {store} from '../../storage/store';
import ProductReview from '../ProductReview';
import SearchResults from '../SearchResults';
import SignInWithPhone from '../SignInWithPhone';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName={'AppTab'}>
      <Drawer.Screen name="AppTab" component={AppTab} />
      <Drawer.Screen name="Categories" component={Categories} />
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="Wishlist" component={Wishlist} />
    </Drawer.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBarContent {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Category" component={Categories} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Offers" component={Offers} />
      <Tab.Screen name="Cart" component={Cart} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function NavigationRoot({navigation}) {
  const {token, isLoading, isSignout} = useSelector(state => state);
  const dispatch = useDispatch();

  const authContext = useMemo(() => {
    return {
      signInContext: data => {
        dispatch(login(data));
      },
      signUpContext: data => {
        dispatch(signup(data));
      },
      signOutContext: () => {
        dispatch(signout());
      },
      handleLoadingContext: data => {
        dispatch(handleLoading(data));
      },
      updateCategoriesContext: data => {
        dispatch(updateCategories(data));
      },
      updateCartCountContext: data => {
        dispatch(updateCartCount(data));
      },
      updateProfileImageContext: data => {
        dispatch(updateProfileImage(data));
      },
    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {isLoading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : token == null ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen
                name="SignInWithPhone"
                component={SignInWithPhone}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: isSignout ? 'pop' : 'push',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="AppDrawer" component={AppDrawer} />
              <Stack.Screen name="OrderDetails" component={OrderDetails} />
              <Stack.Screen name="Account" component={Account} />
              <Stack.Screen name="Products" component={Products} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
              <Stack.Screen name="ProductReview" component={ProductReview} />
              <Stack.Screen name="AddAddress" component={AddAddress} />
              <Stack.Screen name="AddPayment" component={AddPayment} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="SearchResults" component={SearchResults} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const App = () => {

  useEffect(() => {
    enableLatestRenderer();
  }, []);
  
  return (
    <Provider store={store}>
      <NavigationRoot />
    </Provider>
  );
};
export default App;
