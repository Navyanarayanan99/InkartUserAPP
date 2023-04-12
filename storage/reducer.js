import {
  HANDLE_LOADING,
  LOGIN,
  SIGNUP,
  UPDATE_CATEGORIES,
  UPDATE_CART_COUNT,
  SIGNOUT,
  UPDATE_PROFILE_IMAGE,
  UPDATE_WISHLIST_IDS,
  UPDATE_SEARCH_LIST,
} from './constants';

const initialState = {
  token: null,
  isLoading: true,
  isSignout: true,
  profileImage: '',
  firstname: '',
  lastname: '',
  email: '',
  categories: [],
  cartCount: 0,
  whishlistIds: [],
  search: [],
};

export const inKartReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      const {token, profileImage, firstname, lastname, email} = action.payload;
      return {
        ...state,
        token: token,
        profileImage: profileImage,
        lastname: lastname,
        firstname: firstname,
        email: email,
      };
    }
    case SIGNUP: {
      const {token, profileImage, firstname, lastname, email} = action.payload;
      return {
        ...state,
        token: token,
        profileImage: profileImage,
        lastname: lastname,
        firstname: firstname,
        email: email,
      };
    }
    case SIGNOUT: {
      const {token, categories, profileImage, cartCount} = action.payload;
      return {
        ...state,
        token: token,
        profileImage: profileImage,
        categories: categories,
        cartCount: cartCount,
      };
    }
    case HANDLE_LOADING: {
      const {isLoading} = action.payload;
      return {
        ...state,
        isLoading: isLoading,
      };
    }
    case UPDATE_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      };
    }
    case UPDATE_CART_COUNT: {
      return {
        ...state,
        cartCount: action.payload,
      };
    }
    case UPDATE_PROFILE_IMAGE: {
      return {
        ...state,
        profileImage: action.payload,
      };
    }
    case UPDATE_WISHLIST_IDS: {
      return {
        ...state,
        whishlistIds: action.payload,
      };
    }
    case UPDATE_SEARCH_LIST: {
      return {
        ...state,
        search: action.payload,
      };
    }
    default:
      return state;
  }
};
