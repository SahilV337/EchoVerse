import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useState } from 'react';
import { LANGUAGES } from '../../constants/languages';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onSelect: (language: string) => void;
  label: string;
};

export default function LanguageSelector({ 
  selectedLanguage, 
  onSelect, 
  label 
}: LanguageSelectorProps) {
  const [visible, setVisible] = useState(false);
  const selectedLang = LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <View style={styles.container}>
      <Text variant="labelSmall" style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.button}
          >
            {selectedLang?.name || 'Select Language'}
          </Button>
        }
      >
        {LANGUAGES.map((language) => (
          <Menu.Item
            key={language.code}
            onPress={() => {
              onSelect(language.code);
              setVisible(false);
            }}
            title={language.name}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    color: '#666',
  },
  button: {
    width: '100%',
  },
}); 