import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Lightbulb, ArrowRight, Percent } from 'lucide-react';
import { LostFoundItem, MatchSuggestion } from '@/lib/types';

interface MatchSuggestionsProps {
  suggestions: Array<MatchSuggestion & { matchedItem: LostFoundItem }>;
  onViewMatch: (item: LostFoundItem) => void;
}

export function MatchSuggestions({ suggestions, onViewMatch }: MatchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      wallet: '💳',
      phone: '📱',
      keys: '🔑',
      bag: '🎒',
      bottle: '🍼',
      electronics: '💻',
      accessories: '👜',
      documents: '📄',
      other: '❓'
    };
    return icons[category] || '❓';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Potential Matches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion) => (
          <div
            key={suggestion.matchedItemId}
            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">
                    {getCategoryIcon(suggestion.matchedItem.category)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">{suggestion.matchedItem.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.matchedItem.location} • {suggestion.matchedItem.date}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Percent className="h-3 w-3" />
                {suggestion.confidence}%
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {suggestion.reasons.slice(0, 2).map((reason, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {reason}
                </Badge>
              ))}
              {suggestion.reasons.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{suggestion.reasons.length - 2} more
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMatch(suggestion.matchedItem)}
              className="w-full gap-2"
            >
              View Details
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {suggestions.length > 3 && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            +{suggestions.length - 3} more potential matches
          </p>
        )}
      </CardContent>
    </Card>
  );
}