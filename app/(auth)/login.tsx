import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface, Snackbar, Divider } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useGoogleAuth } from '../../src/hooks/useGoogleAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await signIn(email, password);
      router.replace('/(main)/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Failed to login');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await signInWithGoogle();
      if (data?.session) {
        router.replace('/(main)/dashboard');
      } else {
        throw new Error('Failed to get session after Google sign in');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMsg(error.message || 'Failed to login with Google');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
        
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Login
        </Button>

        <Divider style={styles.divider} />

        <Button
          mode="outlined"
          onPress={handleGoogleLogin}
          loading={googleLoading}
          icon="google"
          style={styles.googleButton}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <Link href="/(auth)/register" style={styles.link}>Register</Link>
        </View>
      </Surface>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        action={{
          label: 'Close',
          onPress: () => setShowError(false),
        }}
      >
        {errorMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
  },
  googleButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  link: {
    color: '#6750A4',
  },
}); 