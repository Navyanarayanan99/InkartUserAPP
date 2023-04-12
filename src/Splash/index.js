import React, {useEffect, useContext} from 'react';
import {Image, View} from 'react-native';
import {AuthContext} from '../common/context';
import {style} from './style';

const Splash = () => {
  const {handleLoadingContext} = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      handleLoadingContext({isLoading: false});
    }, 2000);
  }, []);

  return (
    <View style={style.container}>
      <Image
        source={require('../../assets/images/splash.jpg')}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default Splash;
