import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import {inKartReducer} from './reducer';

// Redux Persist Config
const persistConfig = {
  key: 'InKart',
  storage: AsyncStorage,
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, inKartReducer);

// Redux: Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};



