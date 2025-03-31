import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'EchoVerseTranslate',
  slug: 'EchoVerseTranslate',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSMicrophoneUsageDescription: 'This app needs access to microphone for speech recognition.',
      NSSpeechRecognitionUsageDescription: 'This app needs access to speech recognition to convert your speech to text.',
      NSCameraUsageDescription: 'This app needs access to camera.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ],
  },
  plugins: [
    [
      '@react-native-voice/voice',
      {
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        speechRecognitionPermission: 'Allow $(PRODUCT_NAME) to securely recognize user speech'
      }
    ]
  ],
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    googleExpoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
  },
  scheme: 'echoversetranslate',
  owner: "your-actual-expo-username",
}); 