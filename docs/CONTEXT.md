# Indian Language Translator App

## Overview
The Indian Language Translator App is a comprehensive translation solution designed specifically for Indian languages. It supports multiple translation modes including text, speech, and sign language, along with an offline library of common and emergency phrases.

##Tech Stack
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper



## Features

### Core Translation Modes
- **Text-to-Text Translation**: Direct translation between Indian languages
- **Text-to-Speech Translation**: Convert text to spoken language
- **Speech-to-Text Translation**: Convert spoken language to text
- **Text-to-Sign Language Translation**: Convert text to sign language visuals

### Additional Features
- Google Sign-In integration
- Offline access to common and emergency phrases
- Support for multiple Indian languages
- Clean, intuitive user interface

## User Interface Flow

### 1. Authentication
- Welcome screen with sign-up/login options
- Google Sign-In integration
- Email/password authentication

### 2. Main Dashboard
- Grid layout with four primary translation modes
- Quick access to offline phrases
- Language selection dropdowns

### 3. Translation Screens
Each translation mode has its specialized interface:

#### Text-to-Text
- Text input field
- Language selection dropdowns
- Translation output display

#### Text-to-Speech
- Text input field
- Language selection
- Audio playback controls

#### Speech-to-Text
- Voice input button
- Language selection
- Text output display

#### Text-to-Sign Language
- Text input field
- Language selection
- Sign language visualization

### 4. Offline Phrases
- Categorized phrase library
- Search functionality
- Works without internet connection

## Technical Architecture

### Frontend
- **Framework**: React Native with TypeScript
- **Build Tool**: Expo
- **Navigation**: Expo Router
- **UI Framework**: React Native Paper
- **State Management**: React Context / Redux Toolkit

### Backend
- **Core Processing**: Python
- **API Framework**: Flask/Django
- **Database**: Supabase
- **External APIs**: 
  - Google Text-to-Speech
  - Speech Recognition
  - Translation Services

## Database Schema

### Users Table
```sql
users (
  id: uuid primary key
  email: string unique
  full_name: string
  avatar_url: string nullable
  created_at: timestamp
  last_login: timestamp
  preferences: jsonb {
    preferred_languages: string[]
    theme: string
    notifications_enabled: boolean
  }
)
```

### Translations Table
```sql
translations (
  id: uuid primary key
  user_id: uuid foreign key -> users.id
  source_text: text
  target_text: text
  source_language: string
  target_language: string
  translation_mode: string
  created_at: timestamp
  is_favorite: boolean
  metadata: jsonb {
    confidence_score: float
    processing_time: integer
    audio_url: string nullable
    sign_language_url: string nullable
  }
)
```

### Phrases Table
```sql
phrases (
  id: uuid primary key
  category: string
  source_text: text
  translations: jsonb {
    language_code: string
    translated_text: string
    audio_url: string nullable
    sign_language_url: string nullable
  }
  tags: string[]
  created_at: timestamp
  updated_at: timestamp
)
```

### User Favorites Table
```sql
user_favorites (
  id: uuid primary key
  user_id: uuid foreign key -> users.id
  phrase_id: uuid foreign key -> phrases.id
  created_at: timestamp
  notes: text nullable
)
```

### Translation History Table
```sql
translation_history (
  id: uuid primary key
  user_id: uuid foreign key -> users.id
  translation_id: uuid foreign key -> translations.id
  action: string
  created_at: timestamp
  metadata: jsonb
)
```

## Project Structure
```
indian-language-translator/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (main)/              # Main app routes
│   │   ├── dashboard.tsx
│   │   ├── text-to-text.tsx
│   │   ├── text-to-speech.tsx
│   │   ├── speech-to-text.tsx
│   │   ├── text-to-sign.tsx
│   │   └── phrases/
│   │       ├── index.tsx
│   │       └── [category].tsx
│   └── _layout.tsx
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # Shared components
│   │   ├── translation/    # Translation-specific components
│   │   └── phrases/        # Phrase-related components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   │   ├── translation.ts
│   │   ├── speech.ts
│   │   └── auth.ts
│   ├── store/              # State management
│   │   ├── slices/
│   │   └── index.ts
│   ├── types/              # TypeScript types/interfaces
│   ├── utils/              # Helper functions
│   └── constants/          # App constants
├── assets/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── animations/
├── docs/                   # Documentation
├── tests/                  # Test files
├── .env.example           # Environment variables template
├── app.json               # Expo config
├── babel.config.js        # Babel config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies and scripts
```

## Implementation Details

### Language Processing
- Python-based NLP models for Indian language translation
- Custom-trained models for regional language support
- Real-time translation processing

### Speech Processing
- Integration with SpeechRecognition library
- Google TTS for audio output
- Voice activity detection

### Sign Language Module
- Preloaded image dataset
- Text-to-sign mapping system
- Visual representation engine

### Data Management
- Firebase Authentication for user management
- Firestore for storing:
  - User preferences
  - Translation history
  - Offline phrase database

## Development Guidelines

### Code Structure
- MVVM architecture
- Clean code principles
- Modular component design

### UI/UX Standards
- Material Design guidelines
- Accessibility compliance
- Responsive layouts

### Performance Considerations
- Offline-first approach
- Efficient data caching
- Optimized image loading

## Future Enhancements
- Additional Indian language support
- Enhanced sign language animations
- Community contribution features
- Translation history sync
- Custom phrase additions

---

*Note: This documentation is subject to updates as the project evolves.*
