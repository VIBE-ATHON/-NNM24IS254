import { ClaimRequest, LostFoundItem, VerificationQuestion } from './types';

// AI-powered claim validation (simulated)
export function validateClaimWithAI(
  claimRequest: ClaimRequest, 
  item: LostFoundItem, 
  answers: string[]
): { score: number; flags: string[]; isValid: boolean } {
  const flags: string[] = [];
  let score = 100;

  // Check answer quality and relevance
  answers.forEach((answer, index) => {
    const question = item.verificationQuestions?.[index];
    if (!question) return;

    // Basic validation checks
    if (answer.length < 3) {
      score -= 20;
      flags.push(`Answer ${index + 1} too short`);
    }

    // Check for generic/suspicious answers
    const suspiciousPatterns = ['i dont know', 'not sure', 'maybe', 'idk', 'dunno'];
    if (suspiciousPatterns.some(pattern => answer.toLowerCase().includes(pattern))) {
      score -= 15;
      flags.push(`Answer ${index + 1} appears uncertain`);
    }

    // Check if answer relates to item metadata
    const itemKeywords = [
      item.title.toLowerCase(),
      item.category.toLowerCase(),
      item.color?.toLowerCase(),
      item.location.toLowerCase(),
      ...item.tags.map(tag => tag.toLowerCase())
    ].filter(Boolean);

    const answerWords = answer.toLowerCase().split(' ');
    const hasRelevantKeywords = itemKeywords.some(keyword => 
      answerWords.some(word => word.includes(keyword) || keyword.includes(word))
    );

    if (!hasRelevantKeywords && question.correctAnswer) {
      score -= 10;
      flags.push(`Answer ${index + 1} may not match item details`);
    }
  });

  // Location consistency check
  if (item.location && answers.some(answer => 
    answer.toLowerCase().includes('location') || answer.toLowerCase().includes('where')
  )) {
    const locationMentioned = answers.some(answer => 
      answer.toLowerCase().includes(item.location.toLowerCase())
    );
    if (!locationMentioned) {
      score -= 25;
      flags.push('Location details inconsistent');
    }
  }

  // Time consistency check
  const timeSensitiveWords = ['today', 'yesterday', 'morning', 'afternoon', 'evening'];
  const hasTimeReference = answers.some(answer => 
    timeSensitiveWords.some(word => answer.toLowerCase().includes(word))
  );
  
  if (hasTimeReference) {
    const itemDate = new Date(item.date);
    const daysDiff = Math.abs((new Date().getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 7) {
      score -= 15;
      flags.push('Time reference may be inconsistent with item date');
    }
  }

  return {
    score: Math.max(0, score),
    flags,
    isValid: score >= 60 && flags.length < 3
  };
}

// Generate smart verification questions based on item details
export function generateVerificationQuestions(item: LostFoundItem): VerificationQuestion[] {
  const questions: VerificationQuestion[] = [];

  // Question 1: Contents/Details (most important)
  if (item.category === 'wallet' || item.category === 'bag' || item.category === 'backpack') {
    questions.push({
      id: '1',
      question: 'What was inside this item? Please be specific.',
      isRequired: true
    });
  } else if (item.category === 'phone') {
    questions.push({
      id: '1',
      question: 'What brand and model is this phone? Any distinctive features?',
      isRequired: true
    });
  } else if (item.category === 'keys') {
    questions.push({
      id: '1',
      question: 'How many keys were on the keychain and what type of keychain?',
      isRequired: true
    });
  } else {
    questions.push({
      id: '1',
      question: 'Please describe any unique features or markings on this item.',
      isRequired: true
    });
  }

  // Question 2: Circumstance/Location details
  questions.push({
    id: '2',
    question: `Where exactly did you ${item.type === 'lost' ? 'lose' : 'last see'} this item? Be specific about the location.`,
    isRequired: true
  });

  // Question 3: Additional verification (optional but helpful)
  if (item.category === 'electronics') {
    questions.push({
      id: '3',
      question: 'What color/case does this item have? Any stickers or accessories?',
      isRequired: false
    });
  } else if (item.category === 'documents') {
    questions.push({
      id: '3',
      question: 'What name is on this document/ID?',
      isRequired: true
    });
  } else {
    questions.push({
      id: '3',
      question: 'When did you first notice it was missing?',
      isRequired: false
    });
  }

  return questions;
}

// Check if claim token is valid and not expired
export function validateClaimToken(token: string, item: LostFoundItem): boolean {
  if (!item.claimToken || !item.claimTokenExpiry) return false;
  
  const isTokenMatch = item.claimToken === token;
  const isNotExpired = new Date() < new Date(item.claimTokenExpiry);
  
  return isTokenMatch && isNotExpired;
}

// Generate claim token with expiry
export function generateClaimTokenWithExpiry(): { token: string; expiry: string } {
  const prefixes = ['CLM', 'VRF', 'TKN', 'SEC'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const token = `${prefix}-${suffix}`;
  
  // Set expiry to 7 days from now
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  
  return {
    token,
    expiry: expiry.toISOString()
  };
}

// Calculate user reputation score
export function calculateReputationScore(
  successfulClaims: number,
  failedClaims: number,
  itemsReturned: number
): number {
  const baseScore = 50;
  const successBonus = successfulClaims * 10;
  const failurePenalty = failedClaims * 15;
  const returnBonus = itemsReturned * 5;
  
  return Math.max(0, Math.min(100, baseScore + successBonus - failurePenalty + returnBonus));
}