import React from 'react';
import LottieView from 'lottie-react-native';

const SupportTeamAnimation = () => (
  <LottieView
    source={require('../../lottie/support_team.json')}
    loop
    autoPlay
    style={{ width: '60%', alignSelf: 'center' }}
  />
);

export default SupportTeamAnimation;

