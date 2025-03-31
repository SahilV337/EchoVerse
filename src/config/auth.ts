import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';

export const GOOGLE_CONFIG = {
  androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  expoClientId: Constants.expoConfig?.extra?.googleExpoClientId,
};

export const REDIRECT_URI = makeRedirectUri({
  scheme: 'echoversetranslate',
  path: 'auth'
});

export const GOOGLE_REDIRECT_URI = Platform.select({
  web: 'http://localhost:19006', // Your web redirect URI
  default: 'com.yourapp.echoversetranslate://', // Your app's URL scheme
}); 