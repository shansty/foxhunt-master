import React, { useContext, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import { Context as AuthContext } from '../../context/AuthContext';

const ResolveAuthScreen = () => {
  const { tryLocalSignIn } = useContext(AuthContext);

  useEffect(() => {
    tryLocalSignIn();
  }, []);

  return <Spinner />;
};

export default ResolveAuthScreen;
