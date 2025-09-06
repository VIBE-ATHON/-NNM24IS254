import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TagCloudProps {
  tags: Array<{ name: string; count: number }>;
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export function TagCloud({ tags, selectedTags, onTagClick }: TagCloudProps) {
  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-lg';
    if (ratio > 0.6) return 'text-base';
    if (ratio > 0.4) return 'text-sm';
    return 'text-xs';
  };

  const maxCount = Math.max(...tags.map(tag => tag.count));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Trending Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name);
            const sizeClass = getTagSize(tag.count, maxCount);
            
            return (
              <Badge
                key={tag.name}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer hover:bg-primary/80 transition-all duration-200 ${sizeClass} ${
                  isSelected ? 'ring-2 ring-primary/20' : ''
                }`}
                onClick={() => onTagClick(tag.name)}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">
                  {tag.count}
                </span>
              </Badge>
            );
          })}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}