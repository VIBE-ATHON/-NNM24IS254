import { LostFoundItem, MatchSuggestion } from './types';

export function findMatches(item: LostFoundItem, allItems: LostFoundItem[]): MatchSuggestion[] {
  const matches: MatchSuggestion[] = [];
  
  // Only match lost with found items and vice versa
  const candidateItems = allItems.filter(candidate => 
    candidate.id !== item.id && 
    candidate.type !== item.type &&
    candidate.status === 'active'
  );

  for (const candidate of candidateItems) {
    const reasons: string[] = [];
    let confidence = 0;

    // Category match (high weight)
    if (item.category === candidate.category) {
      confidence += 40;
      reasons.push(`Same category: ${item.category}`);
    }

    // Color match (medium weight)
    if (item.color && candidate.color && item.color === candidate.color) {
      confidence += 25;
      reasons.push(`Same color: ${item.color}`);
    }

    // Location proximity (medium weight)
    if (item.location === candidate.location) {
      confidence += 20;
      reasons.push(`Same location: ${item.location}`);
    }

    // Date proximity (low weight)
    const itemDate = new Date(item.date);
    const candidateDate = new Date(candidate.date);
    const daysDiff = Math.abs((itemDate.getTime() - candidateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      confidence += 15;
      reasons.push('Posted within 1 day');
    } else if (daysDiff <= 3) {
      confidence += 10;
      reasons.push('Posted within 3 days');
    }

    // Tag overlap (low weight)
    const commonTags = item.tags.filter(tag => candidate.tags.includes(tag));
    if (commonTags.length > 0) {
      confidence += commonTags.length * 5;
      reasons.push(`Common tags: ${commonTags.join(', ')}`);
    }

    // Description similarity (basic keyword matching)
    const itemWords = item.description.toLowerCase().split(' ');
    const candidateWords = candidate.description.toLowerCase().split(' ');
    const commonWords = itemWords.filter(word => 
      word.length > 3 && candidateWords.includes(word)
    );
    
    if (commonWords.length > 0) {
      confidence += commonWords.length * 3;
      reasons.push(`Similar description keywords`);
    }

    // Only include matches with reasonable confidence
    if (confidence >= 30) {
      matches.push({
        itemId: item.id,
        matchedItemId: candidate.id,
        confidence: Math.min(confidence, 95), // Cap at 95%
        reasons
      });
    }
  }

  // Sort by confidence descending
  return matches.sort((a, b) => b.confidence - a.confidence);
}

export function generateClaimToken(): string {
  const prefixes = ['ITM', 'CLM', 'TKN', 'REF'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}