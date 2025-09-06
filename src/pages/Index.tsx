import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, TrendingUp, Clock, Archive } from 'lucide-react';
import { PostingForm } from '@/components/PostingForm';
import { ItemCard } from '@/components/ItemCard';
import { FilterBar } from '@/components/FilterBar';
import { ClaimDialog } from '@/components/ClaimDialog';
import { TagCloud } from '@/components/TagCloud';
import { MatchSuggestions } from '@/components/MatchSuggestions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppData } from '@/hooks/useLocalStorage';
import { mockItems, categories } from '@/lib/mockData';
import { findMatches } from '@/lib/matcher';
import { LostFoundItem, ClaimConversation, ClaimMessage } from '@/lib/types';
import { toast } from 'sonner';

export default function Index() {
  const { items, setItems, conversations, setConversations, settings, setSettings } = useAppData();
  
  // Initialize with mock data if empty
  useEffect(() => {
    if (items.length === 0) {
      setItems(mockItems);
    }
  }, [items.length, setItems]);

  // UI State
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.className = settings.theme;
  }, [settings.theme]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedLocation && item.location !== selectedLocation) return false;
      if (selectedTags.length > 0 && !selectedTags.some(tag => item.tags.includes(tag))) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [items, searchQuery, selectedType, selectedCategory, selectedLocation, selectedTags]);

  // Get tag statistics
  const tagStats = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [items]);

  // Get match suggestions for recent items
  const recentMatches = useMemo(() => {
    const recentItems = items
      .filter(item => item.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const allMatches = recentItems.flatMap(item => {
      const matches = findMatches(item, items);
      return matches.map(match => ({
        ...match,
        matchedItem: items.find(i => i.id === match.matchedItemId)!
      }));
    }).filter(match => match.matchedItem);

    return allMatches.slice(0, 3);
  }, [items]);

  const handleSubmitItem = (itemData: Omit<LostFoundItem, 'id' | 'createdAt' | 'expiresAt'>) => {
    const newItem: LostFoundItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + settings.autoArchiveDays * 24 * 60 * 60 * 1000).toISOString()
    };

    setItems(prev => [newItem, ...prev]);
    setShowPostingForm(false);
    
    // Check for immediate matches
    const matches = findMatches(newItem, items);
    if (matches.length > 0) {
      toast.success(`Item posted! Found ${matches.length} potential match${matches.length > 1 ? 'es' : ''}.`);
    }
  };

  const handleClaimClick = (item: LostFoundItem) => {
    setSelectedItem(item);
    setClaimDialogOpen(true);
  };

  const handleImageReveal = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, imageBlurred: false } : item
    ));
  };

  const handleSendMessage = (itemId: string, message: string) => {
    const conversationId = `conv_${itemId}_${Date.now()}`;
    
    // Find existing conversation or create new one
    let conversation = conversations.find(conv => conv.itemId === itemId);
    
    if (!conversation) {
      conversation = {
        id: conversationId,
        itemId,
        claimantId: 'user_' + Date.now(),
        messages: [],
        status: 'active',
        messageCount: 0,
        maxMessages: 5
      };
      setConversations(prev => [...prev, conversation!]);
    }

    // Add message
    const newMessage: ClaimMessage = {
      id: `msg_${Date.now()}`,
      itemId,
      senderId: conversation.claimantId,
      message,
      timestamp: new Date().toISOString(),
      isFromPoster: conversation.messageCount % 2 === 1
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversation!.id 
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            messageCount: conv.messageCount + 1
          }
        : conv
    ));
  };

  const handleMarkResolved = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: 'resolved' as const }
        : conv
    ));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedTags([]);
  };

  const currentConversation = selectedItem 
    ? conversations.find(conv => conv.itemId === selectedItem.id)
    : null;

  const stats = {
    total: items.length,
    lost: items.filter(item => item.type === 'lost' && item.status === 'active').length,
    found: items.filter(item => item.type === 'found' && item.status === 'active').length,
    claimed: items.filter(item => item.status === 'claimed').length
  };

  return (
    <div className={`min-h-screen bg-background ${settings.theme}`}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔍</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-sm text-muted-foreground">Smart item recovery platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span>{stats.lost} Lost</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{stats.found} Found</span>
                </div>
              </div>
              <ThemeToggle 
                theme={settings.theme} 
                onThemeChange={(theme) => setSettings(prev => ({ ...prev, theme }))} 
              />
              <Button onClick={() => setShowPostingForm(!showPostingForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Post Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.lost}</div>
              <div className="text-sm text-muted-foreground">Lost Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.found}</div>
              <div className="text-sm text-muted-foreground">Found Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.claimed}</div>
              <div className="text-sm text-muted-foreground">Reunited</div>
            </CardContent>
          </Card>
        </div>

        {/* Posting Form */}
        {showPostingForm && (
          <div className="animate-in slide-in-from-top-4 duration-300">
            <PostingForm onSubmit={handleSubmitItem} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
            />

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClaimClick={handleClaimClick}
                  onImageReveal={handleImageReveal}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or post a new item.
                  </p>
                  <Button onClick={() => setShowPostingForm(true)}>
                    Post New Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Suggestions */}
            {recentMatches.length > 0 && (
              <MatchSuggestions
                suggestions={recentMatches}
                onViewMatch={(item) => {
                  setSelectedItem(item);
                  setClaimDialogOpen(true);
                }}
              />
            )}

            {/* Tag Cloud */}
            <TagCloud
              tags={tagStats}
              selectedTags={selectedTags}
              onTagClick={handleTagToggle}
            />

            {/* Quick Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.name.toLowerCase())}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Claim Dialog */}
      <ClaimDialog
        item={selectedItem}
        isOpen={claimDialogOpen}
        onClose={() => {
          setClaimDialogOpen(false);
          setSelectedItem(null);
        }}
        conversation={currentConversation || null}
        onSendMessage={handleSendMessage}
        onMarkResolved={handleMarkResolved}
      />
    </div>
  );
}