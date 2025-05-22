import { GoogleSignin } from '@react-native-community/google-signin';
import { CLIEND_ID } from '@env';

const googleConfig = () => {
  GoogleSignin.configure({ webClientId: CLIEND_ID, offlineAccess: true });
};

export const googleSignIn = async () => {
  googleConfig();
  return await GoogleSignin.signIn();
};

export const googleSignOut = async () => {
  googleConfig();
  // await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();
  return 'User unauthorised';
};
