import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FilterBucket } from '@/lib/types';

interface FilterBucketsProps {
  buckets: FilterBucket[];
  selectedBucket: string;
  onBucketSelect: (bucketName: string) => void;
  trendingTags: Array<{ name: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function FilterBuckets({ 
  buckets, 
  selectedBucket, 
  onBucketSelect, 
  trendingTags, 
  selectedTags, 
  onTagToggle 
}: FilterBucketsProps) {
  return (
    <div className="space-y-4">
      {/* Quick Filter Buckets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {buckets.map((bucket) => (
            <Button
              key={bucket.name}
              variant={selectedBucket === bucket.name ? 'default' : 'ghost'}
              className="w-full justify-between h-auto p-3"
              onClick={() => onBucketSelect(bucket.name === selectedBucket ? '' : bucket.name)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{bucket.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{bucket.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {bucket.categories.slice(0, 2).join(', ')}
                    {bucket.categories.length > 2 && ` +${bucket.categories.length - 2}`}
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{bucket.count}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Trending Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Trending Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              const TrendIcon = tag.trend === 'up' ? TrendingUp : 
                              tag.trend === 'down' ? TrendingDown : Minus;
              const trendColor = tag.trend === 'up' ? 'text-green-500' : 
                               tag.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
              
              return (
                <Badge
                  key={tag.name}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer hover:bg-primary/80 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => onTagToggle(tag.name)}
                >
                  <div className="flex items-center gap-1">
                    <span>{tag.name}</span>
                    <span className="text-xs opacity-70">{tag.count}</span>
                    <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                  </div>
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
    </div>
  );
}