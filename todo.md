# Lost & Found MVP - Development Plan

## Core Features to Implement (Token-Efficient)

### 1. Main Application Structure
- **src/pages/Index.tsx** - Main dashboard with posting and browsing
- **src/components/PostingForm.tsx** - One-line smart posting with AI parsing
- **src/components/ItemCard.tsx** - Item display with blurred image reveal
- **src/components/FilterBar.tsx** - Dynamic filter shortcuts and tag cloud
- **src/components/ClaimDialog.tsx** - Mini chat for claim verification (max 5 messages)

### 2. Core Data & State Management
- **src/lib/types.ts** - TypeScript interfaces for items, claims, matches
- **src/lib/mockData.ts** - Sample data for demonstration
- **src/lib/aiParser.ts** - Smart parsing logic (simulated AI)
- **src/lib/matcher.ts** - Lightweight matching algorithm
- **src/hooks/useLocalStorage.ts** - Local storage for demo persistence

### 3. UI Components & Features
- **src/components/ThemeToggle.tsx** - Dark mode with vibrant theme switcher
- **src/components/TagCloud.tsx** - Interactive tag navigation
- **src/components/ClaimToken.tsx** - Anonymous posting with token generation

## Implementation Strategy
- Use localStorage for demo data persistence (no backend needed)
- Simulate AI parsing with pattern matching and predefined responses
- Implement blurred image reveal with CSS blur effects
- Create token-efficient matching using metadata comparison
- Build responsive design with modern animations and micro-interactions

## File Relationships
- Index.tsx imports all main components
- Components share types from types.ts
- Mock AI functions simulate real token usage patterns
- Local storage hooks provide data persistence
- Theme system uses Tailwind CSS custom properties

## Success Criteria
- One-line posting works with smart parsing
- Items display with privacy-first blurred images
- Filter system provides instant results
- Claim verification chat is functional
- Dark mode and themes work seamlessly
- Mobile-responsive design