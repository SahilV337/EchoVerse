export const PHRASE_CATEGORIES = {
  COMMON: 'common',
  EMERGENCY: 'emergency',
  MEDICAL: 'medical',
  TRAVEL: 'travel',
} as const;

export const PHRASES = {
  [PHRASE_CATEGORIES.COMMON]: [
    { id: 'c1', text: 'Hello' },
    { id: 'c2', text: 'Thank you' },
    { id: 'c3', text: 'Yes' },
    { id: 'c4', text: 'No' },
    { id: 'c5', text: 'Please' },
    { id: 'c6', text: 'Sorry' },
    { id: 'c7', text: 'Goodbye' },
    { id: 'c8', text: 'How are you?' },
  ],
  [PHRASE_CATEGORIES.EMERGENCY]: [
    { id: 'e1', text: 'Help!' },
    { id: 'e2', text: 'Call an ambulance' },
    { id: 'e3', text: 'Call the police' },
    { id: 'e4', text: 'I need a doctor' },
    { id: 'e5', text: 'There is an emergency' },
    { id: 'e6', text: 'Fire!' },
  ],
  [PHRASE_CATEGORIES.MEDICAL]: [
    { id: 'm1', text: 'I am not feeling well' },
    { id: 'm2', text: 'I have allergies' },
    { id: 'm3', text: 'I need medicine' },
    { id: 'm4', text: 'Where is the nearest hospital?' },
  ],
  [PHRASE_CATEGORIES.TRAVEL]: [
    { id: 't1', text: 'Where is the bathroom?' },
    { id: 't2', text: 'How much does this cost?' },
    { id: 't3', text: 'I am lost' },
    { id: 't4', text: 'Can you help me?' },
  ],
}; 