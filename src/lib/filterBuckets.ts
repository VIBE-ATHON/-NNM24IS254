import { FilterBucket, LostFoundItem } from './types';

export const predefinedBuckets: FilterBucket[] = [
  {
    name: 'ID & Cards',
    icon: '🆔',
    categories: ['wallet', 'documents', 'cards'],
    count: 0
  },
  {
    name: 'Keys & Access',
    icon: '🔑',
    categories: ['keys', 'keychain', 'access'],
    count: 0
  },
  {
    name: 'Electronics',
    icon: '📱',
    categories: ['phone', 'laptop', 'electronics', 'headphones', 'charger'],
    count: 0
  },
  {
    name: 'Bottles & Drinks',
    icon: '🍼',
    categories: ['bottle', 'thermos', 'cup', 'mug'],
    count: 0
  },
  {
    name: 'Bags & Backpacks',
    icon: '🎒',
    categories: ['bag', 'backpack', 'purse', 'luggage'],
    count: 0
  },
  {
    name: 'Accessories',
    icon: '👜',
    categories: ['sunglasses', 'watch', 'jewelry', 'accessories'],
    count: 0
  },
  {
    name: 'Clothing',
    icon: '👕',
    categories: ['jacket', 'shirt', 'hat', 'clothing'],
    count: 0
  },
  {
    name: 'Other Items',
    icon: '❓',
    categories: ['other', 'misc', 'unknown'],
    count: 0
  }
];

export const updateBucketCounts = (buckets: FilterBucket[], items: LostFoundItem[]): FilterBucket[] => {
  return buckets.map(bucket => ({
    ...bucket,
    count: items.filter(item => 
      bucket.categories.some(category => 
        item.category?.toLowerCase().includes(category.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(category.toLowerCase()))
      )
    ).length
  }));
};

export const getTrendingTags = (items: LostFoundItem[]): Array<{ name: string; count: number; trend: 'up' | 'down' | 'stable' }> => {
  const tagCounts: Record<string, number> = {};
  
  // Count current tags
  items.forEach(item => {
    item.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Get recent items (last 7 days) for trend calculation
  const recentItems = items.filter(item => {
    const itemDate = new Date(item.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return itemDate >= weekAgo;
  });

  const recentTagCounts: Record<string, number> = {};
  recentItems.forEach(item => {
    item.tags?.forEach((tag: string) => {
      recentTagCounts[tag] = (recentTagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => {
      const recentCount = recentTagCounts[name] || 0;
      const trend = recentCount > count * 0.3 ? 'up' : 
                   recentCount < count * 0.1 ? 'down' : 'stable';
      
      return { name, count, trend };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
};