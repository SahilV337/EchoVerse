import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006494',
    secondary: '#247BA0',
    error: '#B00020',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1B98E0',
    secondary: '#247BA0',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export type AppTheme = typeof lightTheme; 