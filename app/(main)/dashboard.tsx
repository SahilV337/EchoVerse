import { View, StyleSheet } from 'react-native';
import { Button, Text, Surface, IconButton } from 'react-native-paper';
import { useAuth } from '../../src/contexts/AuthContext';
import { router } from 'expo-router';

type FeatureCard = {
  title: string;
  icon: string;
  route: string;
  description: string;
};

const features: FeatureCard[] = [
  {
    title: 'Text Translation',
    icon: 'translate',
    route: '/text-to-text',
    description: 'Translate text between languages'
  },
  {
    title: 'Text to Speech',
    icon: 'text-to-speech',
    route: '/text-to-speech',
    description: 'Convert text to spoken words'
  },
  {
    title: 'Speech to Text',
    icon: 'microphone',
    route: '/speech-to-text',
    description: 'Convert speech to text'
  },
  {
    title: 'Common Phrases',
    icon: 'book-open-variant',
    route: '/phrases',
    description: 'Quick access to useful phrases'
  }
];

export default function Dashboard() {
  const { signOut, session } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.welcome}>
            Welcome to EchoVerse
          </Text>
          <IconButton 
            icon="cog" 
            mode="contained-tonal"
            onPress={() => router.push('/settings')}
          />
        </View>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Select a translation feature to get started
        </Text>
        
        <View style={styles.grid}>
          {features.map((feature) => (
            <Surface 
              key={feature.route}
              style={styles.card} 
              elevation={2}
              onTouchEnd={() => router.push(feature.route)}
            >
              <IconButton
                icon={feature.icon}
                size={32}
                style={styles.cardIcon}
              />
              <Text variant="titleMedium" style={styles.cardTitle}>
                {feature.title}
              </Text>
              <Text variant="bodySmall" style={styles.cardDescription}>
                {feature.description}
              </Text>
            </Surface>
          ))}
        </View>

        <Button 
          mode="outlined" 
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  surface: {
    padding: 16,
    borderRadius: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcome: {
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    textAlign: 'center',
    color: '#666',
  },
  signOutButton: {
    marginTop: 24,
  },
}); 