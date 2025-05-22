import React from 'react';
import LottieView from 'lottie-react-native';

const WorldAnimation = () => (
  <LottieView
    source={require('../../lottie/world.json')}
    loop
    autoPlay
    style={{ width: '60%' }}
  />
);

export default WorldAnimation;

