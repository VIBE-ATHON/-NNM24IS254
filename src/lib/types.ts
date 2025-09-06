export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  color?: string;
  location: string;
  date: string;
  imageUrl?: string;
  imageBlurred: boolean;
  claimToken?: string;
  claimTokenExpiry?: string;
  status: 'active' | 'claimed' | 'archived';
  tags: string[];
  contactInfo?: string;
  createdAt: string;
  expiresAt: string;
  renewCount?: number;
  verificationQuestions?: VerificationQuestion[];
  finderUserId?: string;
}

export interface VerificationQuestion {
  id: string;
  question: string;
  correctAnswer?: string;
  isRequired: boolean;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  claimantId: string;
  claimToken?: string;
  quizAnswers: string[];
  proofPhotoUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  aiValidationScore?: number;
  aiValidationFlags?: string[];
}

export interface ClaimConversation {
  id: string;
  claimRequestId: string;
  messages: ClaimMessage[];
  status: 'active' | 'resolved' | 'expired';
  messageCount: number;
  maxMessages: number;
}

export interface ClaimMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  timestamp: string;
  isFromFinder: boolean;
}

export interface UserReputation {
  userId: string;
  successfulClaims: number;
  failedClaims: number;
  itemsReturned: number;
  itemsFound: number;
  reputationScore: number;
  badges: string[];
  isVerifiedClaimant: boolean;
  isFlagged: boolean;
}

export interface MatchSuggestion {
  itemId: string;
  matchedItemId: string;
  confidence: number;
  reasons: string[];
  aiGenerated: boolean;
}

export interface ParsedInput {
  item: string;
  category: string;
  color?: string;
  location: string;
  date: string;
  description: string;
}

export interface UserStats {
  id: string;
  recoveryScore: number;
  itemsPosted: number;
  itemsReturned: number;
  itemsFound: number;
  level: string;
}

export type Theme = 'light' | 'dark' | 'emerald' | 'indigo' | 'rose';

export interface AppSettings {
  theme: Theme;
  autoArchiveDays: number;
  showBlurredImages: boolean;
  isAnonymous: boolean;
  enableAIValidation: boolean;
}

export interface FilterBucket {
  name: string;
  icon: string;
  categories: string[];
  count: number;
}