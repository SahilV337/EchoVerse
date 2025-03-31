import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { GOOGLE_CONFIG } from '../config/auth';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CONFIG.androidClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
    expoClientId: GOOGLE_CONFIG.expoClientId,
    webClientId: GOOGLE_CONFIG.webClientId,
    responseType: 'id_token',
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'echoversetranslate',
      path: 'auth'
    }),
  });

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await promptAsync();
      console.log('Google auth result:', result); // For debugging

      if (result?.type === 'success') {
        const { authentication } = result;
        
        if (!authentication?.idToken) {
          throw new Error('No ID token present in authentication response');
        }

        // Exchange Google token for Supabase session
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: authentication.idToken,
          nonce: 'nonce', // Optional but recommended
        });

        if (error) {
          console.error('Supabase auth error:', error);
          throw error;
        }

        return data;
      } else if (result?.type === 'error') {
        throw new Error(result.error?.message || 'Google sign in failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }, [promptAsync]);

  return {
    signInWithGoogle,
    isLoading: !request,
  };
} 