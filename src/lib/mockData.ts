import { LostFoundItem } from './types';

export const mockItems: LostFoundItem[] = [
  {
    id: '1',
    title: 'Black Leather Wallet',
    description: 'Black leather wallet with credit cards inside',
    type: 'lost',
    category: 'wallet',
    color: 'black',
    location: 'Library Cafeteria',
    date: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    imageBlurred: true,
    status: 'active',
    tags: ['wallet', 'leather', 'black', 'cards'],
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-01-29T10:30:00Z',
    claimToken: 'WLT-ABC123'
  },
  {
    id: '2',
    title: 'Blue Water Bottle',
    description: 'Stainless steel water bottle, blue color',
    type: 'found',
    category: 'bottle',
    color: 'blue',
    location: 'Engineering Building',
    date: '2024-01-14',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    imageBlurred: true,
    status: 'active',
    tags: ['bottle', 'blue', 'stainless', 'water'],
    createdAt: '2024-01-14T14:20:00Z',
    expiresAt: '2024-01-28T14:20:00Z'
  },
  {
    id: '3',
    title: 'Red Backpack',
    description: 'Red Nike backpack with laptop compartment',
    type: 'lost',
    category: 'bag',
    color: 'red',
    location: 'Student Center',
    date: '2024-01-13',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    imageBlurred: true,
    status: 'active',
    tags: ['backpack', 'red', 'nike', 'laptop'],
    createdAt: '2024-01-13T09:15:00Z',
    expiresAt: '2024-01-27T09:15:00Z',
    claimToken: 'BAG-XYZ789'
  },
  {
    id: '4',
    title: 'iPhone 14 Pro',
    description: 'Black iPhone 14 Pro with cracked screen',
    type: 'found',
    category: 'phone',
    color: 'black',
    location: 'Parking Lot B',
    date: '2024-01-12',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    imageBlurred: true,
    status: 'active',
    tags: ['phone', 'iphone', 'black', 'cracked'],
    createdAt: '2024-01-12T16:45:00Z',
    expiresAt: '2024-01-26T16:45:00Z'
  },
  {
    id: '5',
    title: 'Silver Keys',
    description: 'Set of keys with Toyota keychain',
    type: 'found',
    category: 'keys',
    color: 'silver',
    location: 'Gym Entrance',
    date: '2024-01-11',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    imageBlurred: true,
    status: 'active',
    tags: ['keys', 'toyota', 'silver', 'keychain'],
    createdAt: '2024-01-11T18:30:00Z',
    expiresAt: '2024-01-25T18:30:00Z'
  }
];

export const popularTags = [
  'wallet', 'keys', 'phone', 'backpack', 'bottle', 'laptop', 'headphones',
  'sunglasses', 'watch', 'jewelry', 'cards', 'charger'
];

export const popularLocations = [
  'Library', 'Cafeteria', 'Student Center', 'Engineering Building', 
  'Parking Lot A', 'Parking Lot B', 'Gym', 'Dormitory', 'Lecture Hall'
];

export const categories = [
  { name: 'Electronics', icon: '📱', count: 12 },
  { name: 'Accessories', icon: '👜', count: 8 },
  { name: 'Keys', icon: '🔑', count: 15 },
  { name: 'Bottles', icon: '🍼', count: 6 },
  { name: 'Bags', icon: '🎒', count: 9 },
  { name: 'Jewelry', icon: '💍', count: 4 },
  { name: 'Documents', icon: '📄', count: 7 },
  { name: 'Other', icon: '❓', count: 3 }
];