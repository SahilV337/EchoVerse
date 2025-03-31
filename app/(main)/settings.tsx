import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Switch, List } from 'react-native-paper';
import LanguageSelector from '../../src/components/translation/LanguageSelector';
import { useSettings } from '../../src/contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>Language Settings</List.Subheader>
          <View style={styles.languageSelectors}>
            <LanguageSelector
              selectedLanguage={settings.defaultSourceLanguage}
              onSelect={(lang) => updateSettings({ defaultSourceLanguage: lang })}
              label="Default Source Language"
            />
            <LanguageSelector
              selectedLanguage={settings.defaultTargetLanguage}
              onSelect={(lang) => updateSettings({ defaultTargetLanguage: lang })}
              label="Default Target Language"
            />
          </View>
        </List.Section>

        <List.Section>
          <List.Subheader>App Settings</List.Subheader>
          <List.Item
            title="Auto-speak translations"
            right={() => (
              <Switch
                value={settings.autoSpeak}
                onValueChange={(value) => updateSettings({ autoSpeak: value })}
              />
            )}
          />
          <List.Item
            title="Keep translation history"
            right={() => (
              <Switch
                value={settings.keepHistory}
                onValueChange={(value) => updateSettings({ keepHistory: value })}
              />
            )}
          />
        </List.Section>
      </Surface>
    </ScrollView>
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
  },
  languageSelectors: {
    gap: 16,
  },
}); 