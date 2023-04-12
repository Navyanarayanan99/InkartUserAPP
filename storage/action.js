import {
  LOGIN,
  SIGNUP,
  SIGNOUT,
  UPDATE_CART_COUNT,
  HANDLE_LOADING,
  UPDATE_CATEGORIES,
  UPDATE_PROFILE_IMAGE,
  UPDATE_WISHLIST_IDS,
  UPDATE_SEARCH_LIST,
} from './constants';

export const login = data => ({
  type: LOGIN,
  payload: {
    token: data.userId,
    profileImage: data.profileImage,
    lastname: data?.lastname,
    firstname: data?.firstname,
    email: data?.email,
  },
});

export const signup = data => ({
  type: SIGNUP,
  payload: {
    token: data.userId,
    profileImage: data.profileImage,
    lastname: data?.lastname,
    firstname: data?.firstname,
    email: data?.email,
  },
});

export const signout = () => ({
  type: SIGNOUT,
  payload: {
    token: null,
    profileImage: '',
    cartCount: 0,
    categories: [],
    whishlistIds: [],
    firstname: '',
    lastname: '',
    email: '',
  }
});

export const handleLoading = data => ({
  type: HANDLE_LOADING,
  payload: data,
});

export const updateCategories = data => ({
  type: UPDATE_CATEGORIES,
  payload: data.categories,
});

export const updateCartCount = data => ({
  type: UPDATE_CART_COUNT,
  payload: data.cartCount,
});

export const updateProfileImage = data => ({
  type: UPDATE_PROFILE_IMAGE,
  payload: data.profileImage,
});

export const updateWishlistIds = data => ({
  type: UPDATE_WISHLIST_IDS,
  payload: data.whishlistIds,
});

export const updateSearchList = data => ({
  type: UPDATE_SEARCH_LIST,
  payload: data.search,
});