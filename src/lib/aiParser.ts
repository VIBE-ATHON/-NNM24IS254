import { ParsedInput } from './types';

// Simulated AI parsing - in production this would call an LLM API
export function parseSmartInput(input: string): ParsedInput {
  const lowerInput = input.toLowerCase();
  
  // Extract item type
  let item = 'unknown item';
  let category = 'other';
  
  const itemPatterns = [
    { keywords: ['wallet', 'purse'], item: 'wallet', category: 'wallet' },
    { keywords: ['phone', 'iphone', 'android', 'mobile'], item: 'phone', category: 'phone' },
    { keywords: ['keys', 'key'], item: 'keys', category: 'keys' },
    { keywords: ['backpack', 'bag', 'rucksack'], item: 'bag', category: 'bag' },
    { keywords: ['bottle', 'water bottle', 'thermos'], item: 'bottle', category: 'bottle' },
    { keywords: ['laptop', 'computer', 'macbook'], item: 'laptop', category: 'electronics' },
    { keywords: ['headphones', 'earbuds', 'airpods'], item: 'headphones', category: 'electronics' },
    { keywords: ['sunglasses', 'glasses'], item: 'glasses', category: 'accessories' },
    { keywords: ['watch', 'smartwatch'], item: 'watch', category: 'accessories' },
    { keywords: ['card', 'id', 'license'], item: 'card', category: 'documents' }
  ];

  for (const pattern of itemPatterns) {
    if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
      item = pattern.item;
      category = pattern.category;
      break;
    }
  }

  // Extract color
  let color: string | undefined;
  const colorPatterns = [
    'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 
    'pink', 'brown', 'gray', 'grey', 'silver', 'gold'
  ];
  
  for (const colorPattern of colorPatterns) {
    if (lowerInput.includes(colorPattern)) {
      color = colorPattern;
      break;
    }
  }

  // Extract location
  let location = 'unknown location';
  const locationPatterns = [
    { keywords: ['library'], location: 'Library' },
    { keywords: ['cafeteria', 'cafe', 'food court'], location: 'Cafeteria' },
    { keywords: ['student center', 'center'], location: 'Student Center' },
    { keywords: ['engineering', 'eng building'], location: 'Engineering Building' },
    { keywords: ['parking', 'lot'], location: 'Parking Lot' },
    { keywords: ['gym', 'fitness'], location: 'Gym' },
    { keywords: ['dorm', 'dormitory'], location: 'Dormitory' },
    { keywords: ['lecture', 'classroom', 'class'], location: 'Lecture Hall' }
  ];

  for (const pattern of locationPatterns) {
    if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
      location = pattern.location;
      break;
    }
  }

  // Extract date
  let date = new Date().toISOString().split('T')[0]; // Default to today
  if (lowerInput.includes('yesterday')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    date = yesterday.toISOString().split('T')[0];
  } else if (lowerInput.includes('today')) {
    date = new Date().toISOString().split('T')[0];
  }

  return {
    item,
    category,
    color,
    location,
    date,
    description: input
  };
}

// Generate ghost text suggestions based on partial input
export function generateGhostText(partialInput: string): string {
  const suggestions = [
    'Lost black wallet in cafeteria today',
    'Found blue water bottle near library',
    'Lost iPhone in parking lot yesterday',
    'Found red backpack in student center',
    'Lost keys with Toyota keychain in gym'
  ];

  if (partialInput.length < 3) return '';
  
  const matchingSuggestion = suggestions.find(s => 
    s.toLowerCase().startsWith(partialInput.toLowerCase())
  );
  
  return matchingSuggestion ? matchingSuggestion.slice(partialInput.length) : '';
}