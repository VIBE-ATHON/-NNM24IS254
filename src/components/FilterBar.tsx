import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { categories, popularTags, popularLocations } from '@/lib/mockData';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: 'all' | 'lost' | 'found';
  onTypeChange: (type: 'all' | 'lost' | 'found') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedTags,
  onTagToggle,
  onClearFilters
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = selectedType !== 'all' || selectedCategory || selectedLocation || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items, locations, or descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Type Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('all')}
        >
          All Items
        </Button>
        <Button
          variant={selectedType === 'lost' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('lost')}
        >
          Lost Items
        </Button>
        <Button
          variant={selectedType === 'found' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('found')}
        >
          Found Items
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Category and Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name.toLowerCase()} value={category.name.toLowerCase()}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {category.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedLocation} onValueChange={onLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    {popularLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tag Cloud */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Popular Tags</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => onTagToggle(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Active filters:</span>
                  {selectedType !== 'all' && (
                    <Badge variant="secondary">{selectedType}</Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary">{selectedCategory}</Badge>
                  )}
                  {selectedLocation && (
                    <Badge variant="secondary">{selectedLocation}</Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}